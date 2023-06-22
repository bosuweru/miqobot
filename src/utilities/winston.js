"use strict";

const winston = require("winston");

const logger = winston.createLogger({
  level:
    process.env.NODE_ENV === "development"
      ? /* istanbul ignore next */ "debug"
      : "info",
  levels: winston.config.npm.levels,
  silent:
    process.env.NODE_ENV === "workflow"
      ? true
      : /* istanbul ignore next */ false,
  transports: [],
  exitOnError:
    process.env.NODE_ENV === "development"
      ? /* istanbul ignore next */ true
      : false,
});

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({}),
  winston.format.printf(
    /* istanbul ignore next */ ({ level, message, timestamp }) => {
      return `${timestamp} [${level}] ${message}`;
    }
  )
);

const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
});

logger.add(consoleTransport);

module.exports = { logger };
