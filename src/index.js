"use strict";

const { load } = require("./utils/dotenv");
load();

/** @see {@link https://discordjs.guide/sharding/#getting-started} */
const { ShardingManager } = require("discord.js");
const { logger } = require("./utils/pino");

process
  .on("uncaughtException", (error) => {
    logger.fatal(`${error}`);
    process.exit(-1);
  })
  .on("unhandledRejection", (reason) => {
    logger.fatal(`${reason}`);
    process.exit(-1);
  });

const manager = new ShardingManager("src/client/bot.js", {
  token: process.env.SECRET_TOKEN,
  execArgv: ["--trace-warnings"],
  shardArgs: ["--ansi", "--color"],
});

manager.on("shardCreate", (shard) => {
  logger.info(`Shard ${shard.id} launched.`);

  shard.on("ready", () => {
    logger.info(`Shard ${shard.id} online.`);
  });
});

manager.spawn();
