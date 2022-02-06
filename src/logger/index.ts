/**
 * This module can be out-sourced to an inhouse package feed or npm registry,
 * to facilitate reusibility
 */
import pino, { Logger } from 'pino';

/** default pino levels:
 *  off   100 ("silent")
 *  fatal 60
 *  error 50
 *  warn  40
 *  info  30
 *  debug 20
 *  trace 10
 */

/**
 * DEFAULT_LOG_LEVEL - In a real deployments, 
 * this variable should be parameterized using environment varibale
 * */ 
const DEFAULT_LOG_LEVEL = 'info';

const logger: Logger = pino({
  name: 'MyStatsApp', // should be parameterised using environment varibale
  level: DEFAULT_LOG_LEVEL,
  useLevelLabels: true,
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

export { logger as Logger};
