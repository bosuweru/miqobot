"use strict";

const winston = require("winston");

const level = process.env.NODE_ENV === "development" ? "debug" : "info";
const levels = winston.config.npm.levels;
const silent = process.env.NODE_ENV === "staging" ? true : false;
const transports = [];
const exitOnError = false;

const logger = winston.createLogger({
  level: level,
  levels: levels,
  silent: silent,
  transports: transports,
  exitOnError: exitOnError,
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message }) => {
        return `[${level}] ${message}`;
      })
    ),
  })
);

module.exports = { logger };
