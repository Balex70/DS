import pino from 'pino';

let logger: pino.Logger;

export function getPinoLogger(): pino.Logger {
  if (!logger) {
    const transport = pino.transport({
      target: 'pino/file',
      options: { destination: './logs/app.log', mkdir: true },
    });

    logger = pino(
      {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level(label) {
            return { level: label.toUpperCase() };
          },
        },
      },
      transport
    );
  }

  return logger;
}
