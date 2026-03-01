import { SQLiteWatcher } from "bun-sqlite-watcher";
import { Database } from "bun:sqlite";

const db = new Database("./.beads/beads.db");
const watcher = new SQLiteWatcher(db);

/**
 * Uses Bun's built-in SQLite to verify the exact status of a task 
 * without the overhead of the full SDK or CLI.
 */
function isTaskInProgress(taskId: string): boolean {
  const stmt = db.prepare("SELECT status FROM beads WHERE id = ?")
  const result = stmt.get(taskId) as { status: string } | null;
  return result?.status === "in_progress";
}

console.log("📡 SDK & SQLite Watcher Active. Waiting for manual 'in_progress' triggers...");

// Listen for updates specifically on the 'beads' table
watcher.subscribe("beads", (event) => {
  if (event.type === "UPDATE") {
    // Perform a fast query to see if a task just moved to 'in_progress'
    const activeTask = db.query(
      "SELECT id FROM beads WHERE id = ? AND status = 'in_progress'"
    ).get(event.rowId);

    if (activeTask) {
      console.log(`🚀 Task ${activeTask.id} is now in_progress. Starting harness...`);
      // Trigger your harness logic here
    }

    for (const task of activeTasks) {
      console.log(`\n🔔 Event detected: Task ${task.id} ("${task.title}") is in_progress.`);
      
      // 2. Launch the harness script for the specific task
      // We use 'bun run' to execute the harness logic as a child process
      console.log(`🚀 Engaging Agentic Harness for ${task.id}...`);
      
      try {
        await $`bun run harness.ts --task ${task.id}`;
      } catch (err) {
        console.error(`❌ Harness failed for task ${task.id}:`, err);
        
        // Use SDK to mark as blocked if the harness itself crashed
        await beads.updateTask(task.id, { 
          status: "blocked", 
          note: "Harness Error: The execution process crashed. Check terminal logs." 
        });
      }
    }
  }
});
