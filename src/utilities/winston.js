"use strict";

const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  levels: winston.config.npm.levels,
  silent: false,
  transports: [],
  exitOnError: false,
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(),
  })
);

module.exports = { logger };
