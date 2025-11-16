import pino from "pino";

const logger = pino({
  transport: process.env.NODE_ENV === "development"
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
        },
      }
    : undefined,
});

export default logger;