"use strict";

const path = require("node:path");

const ShardingManager = require("discord.js").ShardingManager;

const { logger } = require("./utilities/winston");

const manager = new ShardingManager(path.join(__dirname, "client/miqobot.js"), {
  mode: "process",
  token: process.env.SECRET_TOKEN,
  respawn: process.env.NODE_ENV === "production" ? true : false,
  execArgv: ["--trace-warnings"],
  shardArgs: ["--ansi", "--color"],
  shardList: "auto",
  totalShards: "auto",
});

manager.on("shardCreate", (shard) => {
  logger.info(`Shard[${shard.id}]: The shard has been created.`);
});

if (process.env.NODE_ENV !== "staging") manager.spawn();
