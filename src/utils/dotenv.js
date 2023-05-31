"use strict";

/** @see {@link https://github.com/motdotla/dotenv#readme} */
const { config } = require("dotenv");
const { expand } = require("dotenv-expand");

function load() {
  const result = config({
    path: "private/.env",
    debug: false,
    encoding: "utf8",
    override: false,
  });

  if (result.error) throw result.error;
  expand(result);
}

module.exports = { load };
