/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Converts seconds to milliseconds
 *
 * @param seconds - Time in seconds.
 * @return milliseconds - Converted time in milliseconds.
 */
export const secondsToMilliseconds = (seconds: number) => seconds * 1000;

export const millisecondsToSeconds = (milliseconds: number) => milliseconds / 1000;
