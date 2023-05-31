"use strict";

const { load } = require("./utils/dotenv");
load();

/** @see {@link https://discordjs.guide/sharding/#getting-started} */
const { ShardingManager } = require("discord.js");
const { logger } = require("./utils/pino");

const manager = new ShardingManager("src/client/bot.js", {
  token: process.env.SECRET_TOKEN,
});

manager.on("shardCreate", (shard) => {
  logger.info(`Shard ${shard.id} launched.`);
});

manager.spawn();
