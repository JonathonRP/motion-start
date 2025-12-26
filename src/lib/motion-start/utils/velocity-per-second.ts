/**
 * Converts velocity from per-frame to per-second
 * Useful for normalizing animation velocities
 * @param velocity - Velocity per frame
 * @param frameDuration - Frame duration in milliseconds
 * @returns Velocity per second
 */
export function velocityPerSecond(velocity: number, frameDuration: number) {
	return frameDuration ? velocity * (1000 / frameDuration) : 0;
}
