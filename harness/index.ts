import { Database } from "bun:sqlite";
import { $ } from "bun";

const db = new Database("./.beads/beads.db");

// check for claude-code availability
try {
  await $`claude-code --version`.quiet();
} catch {
  console.error("❌ claude-code CLI not found. Please install it to use the Agentic Harness.");
  process.exit(1);
}

// 1. Initialize the 'Journal' table for the One-to-Many relationship
db.run(`
  CREATE TABLE IF NOT EXISTS harness_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT NOT NULL,
    attempt_number INTEGER,
    error_summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES beads(id)
  )
`);

/**
 * Retrieves the full history of failures for a specific task
 */
function getTaskHistory(taskId: string): string {
  const stmt = db.prepare(
    "SELECT attempt_number, error_summary, created_at FROM harness_attempts WHERE task_id = ? ORDER BY attempt_number ASC"
  )
  
  const history = stmt.all(taskId) as any[];

  if (history.length === 0) return "This is your first attempt at this task.";

  return history.map(h => 
    `[Attempt ${h.attempt_number} at ${h.created_at}]:\n${h.error_summary}`
  ).join("\n\n---\n\n");
}

/**
 * New Feature agentic execution loop for handling tasks with multiple attempts
 * @param taskId 
 */
async function runExecutionLoop(taskId: string) {
  const task = await beads.getTask(taskId);
  const historyMemory = getTaskHistory(taskId);

  console.log(`\n🚀 Executing ${taskId}. History: ${historyMemory.split('\n').length} lines.`);

  // 2. EXECUTE: The Agent sees the entire timeline of failures
  await $`claude-code "Task: ${task.title}.
    Full Execution History:
    ${historyMemory}
    
    INSTRUCTIONS:
    1. Review all previous attempts. Identify the 'root cause' that connects them.
    2. Do not repeat any failed strategies.
    3. Use TDD to implement the fix.
    4. If you have failed more than 3 times, take a step back and explain your new architectural plan before coding."`;

  // 3. VERIFY
  const check = await $`npm test --json`.nothrow().quiet();
  
  if (check.exitCode === 0) {
    // Optional: Clear history on success or keep it for project-wide learning
    db.run("DELETE FROM harness_attempts WHERE task_id = ?", [taskId]);
    await beads.updateTask(taskId, { status: "completed", note: "Verified after successful TDD." });
    console.log(`✅ ${taskId} passed.`);
  } else {
    // 4. RECORD NEW ATTEMPT (One-to-Many)
    const errorLog = check.stdout.toString().slice(0, 800); // Concisely truncated
    
    // Get next attempt number
    const lastAttempt = db.query("SELECT MAX(attempt_number) as max FROM harness_attempts WHERE task_id = ?").get(taskId) as any;
    const nextAttempt = (lastAttempt?.max || 0) + 1;

    db.run(
      "INSERT INTO harness_attempts (task_id, attempt_number, error_summary) VALUES (?, ?, ?)",
      [taskId, nextAttempt, errorLog]
    );

    await beads.updateTask(taskId, { 
      status: "blocked", 
      note: `Harness: Attempt ${nextAttempt} failed. Reviewing history...` 
    });
    console.error(`❌ ${taskId} failed attempt ${nextAttempt}. History updated.`);
  }
}

console.log("📡 One-to-Many Agentic Harness (Bun + Beads) Active.");

console.log("🚀 Agentic Harness Active [SDK + SQLite Edition]");
console.log("Waiting for tasks to be moved to 'in_progress'...");

/**
 * 3. THE EXECUTION LOOP (Plan -> Execute -> Verify) Boken code base loop
 * @param taskId
 */
async function runExecutionLoop(taskId: string, details: any) {
  // A. CAPTURE BASELINE (Verify phase start)
  console.log("📊 Capturing test baseline...");
  const baseline = await $`npm test --json`.nothrow().quiet();
  const baselineFailures = baseline.exitCode === 0 ? 0 : JSON.parse(baseline.stdout.toString()).stats.failures;

  // B. EXECUTE (The Agent)
  // We pass the SQLite metadata directly to the agent as context
  console.log(`🤖 Engaging Agent for task ${taskId}...`);
  await $`claude-code "Task: ${details.title}. 
    Baseline Failures: ${baselineFailures}. 
    Implement this feature/fix. 
    Use TDD: Write a failing test first, then fix. 
    Do not exit until your specific test passes."`;

  // C. VERIFY (Regression Gate)
  console.log("🧪 Running regression suite...");
  const finalCheck = await $`npm test --json`.nothrow().quiet();
  
  if (finalCheck.exitCode === 0) {
    // SUCCESS: Use SDK to close and commit
    await beads.updateTask(taskId, { 
      status: "completed", 
      note: `Verified: Regression suite passed (Baseline: ${baselineFailures} fails).` 
    });
    await $`git commit -am "Harness verified and completed task ${taskId}"`;
    console.log(`✅ Task ${taskId} successfully closed.`);
  } else {
    // FAILURE: Mark as blocked if regressions were introduced
    const finalFailures = JSON.parse(finalCheck.stdout.toString()).stats.failures;
    await beads.updateTask(taskId, { 
      status: "blocked", 
      note: `Harness: Verification failed. Codebase has ${finalFailures} failing tests.` 
    });
    console.error(`❌ Task ${taskId} failed verification gate.`);
  }
}

/**
 * Runs the test suite for baseline and determine if code is stable - showing logic to help with code stability checks.
 * later to use in the harness loop. so agent can decide whether to proceed with new feature or stabilize first.
 * @returns 
 */
async function runTests() {
  const result = await $`npm test --json`.nothrow().quiet();
  return {
    success: result.exitCode === 0,
    failures: result.exitCode === 0 ? 0 : JSON.parse(result.stdout.toString()).stats.failures,
    raw: result.stdout.toString()
  };
}

async function startHarness() {
  console.log("🛠️ Agentic Harness Active (SDK Mode). Waiting for 'in_progress' beads...");

  while (true) {
    // SDK: Get tasks you've moved to in_progress
    const activeTasks = await beads.listTasks({ status: "in_progress" });

    if (activeTasks.length === 0) {
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }

    for (const task of activeTasks) {
      console.log(`\n📍 Claimed Task: ${task.id} - ${task.title}`);

      // 1. STABILIZE: Check if codebase is already broken
      const baseline = await runTests();
      if (!baseline.success) {
        console.warn(`⚠️ Codebase unstable. Current failures: ${baseline.failures}`);
      }

      // 2. EXECUTE: The Agent Cycle
      // We pass task data directly from the SDK object to the agent
      await $`claude-code "Task ID: ${task.id}. Description: ${task.description}. 
        Current Test State: ${baseline.success ? 'Green' : 'Red (' + baseline.failures + ' fails)'}. 
        Implement the feature/fix using TDD. Do not exit until tests pass."`;

      // 3. VERIFY: Regression Gate
      console.log("🧪 Verifying implementation...");
      const finalCheck = await runTests();

      if (finalCheck.success) {
        // SDK: Close the bead directly
        await beads.updateTask(task.id, { 
          status: "completed", 
          note: `Harness: Verified. Baseline was ${baseline.failures}, current is 0.` 
        });
        await $`git commit -am "Completed ${task.id}: Verified by Harness"`;
        console.log(`✅ ${task.id} closed successfully.`);
      } else {
        // SDK: Block if it introduced a regression or didn't fix the bug
        await beads.updateTask(task.id, { 
          status: "blocked", 
          note: `Harness: Verification failed. Current failures: ${finalCheck.failures}` 
        });
        console.error(`❌ ${task.id} failed verification.`);
      }
    }
  }
}