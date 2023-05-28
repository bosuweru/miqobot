"use strict";

const { load } = require("./utilities/dotenv");
const { ShardingManager } = require("discord.js");

load();

const manager = new ShardingManager("src/client/bot.js", {
  token: process.env.SECRET_TOKEN,
});

manager.on("shardCreate", (shard) => {
  console.log(`Shard ${shard.id} launched.`);
});

manager.spawn();
