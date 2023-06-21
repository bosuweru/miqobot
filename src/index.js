"use strict";

const path = require("node:path");

const { logger } = require("./utilities/winston");
const { ShardingManager } = require("discord.js");

const manager = new ShardingManager(path.join(__dirname, "client/miqobot.js"), {
  mode: "process",
  token: process.env.SECRET_TOKEN,
  respawn:
    process.env.NODE_ENV === "production"
      ? /* istanbul ignore next */ true
      : false,
  execArgv: ["--trace-warnings"],
  shardArgs: ["--ansi", "--color"],
  shardList: "auto",
  totalShards: "auto",
});

manager.on("shardCreate", (shard) => {
  logger.info(`Shard [${shard.id}] created.`);
});

/* istanbul ignore if */
if (process.env.NODE_ENV !== "workflow") manager.spawn();

module.exports = { manager };
