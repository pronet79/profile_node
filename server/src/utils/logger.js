/* Minimal structured logger. Swap for pino/winston in production. */
const ts = () => new Date().toISOString();
export const logger = {
  info: (msg) => console.log(`[${ts()}] INFO  ${msg}`),
  warn: (msg) => console.warn(`[${ts()}] WARN  ${msg}`),
  error: (msg) => console.error(`[${ts()}] ERROR ${msg}`),
};
