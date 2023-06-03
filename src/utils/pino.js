"use strict";

/** @see {@link https://getpino.io/} */
const pino = require("pino");

let logger;

if (process.env.NODE_ENV === "development") {
  logger = pino();
} else {
  const transport = pino.transport({
    target: "pino/file",
    options: { destination: "./logs/miqobot.log" },
  });
  logger = pino(transport);
}

module.exports = { logger };
