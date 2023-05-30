"use strict";

/** @see {@link https://github.com/motdotla/dotenv#readme} */
const { config } = require("dotenv");
const { expand } = require("dotenv-expand");

const result = config({
  path: "private/.env",
  debug: false,
  encoding: "utf8",
  override: false,
});

if (result.error) throw result.error;
expand(result);

/** @see {@link https://discordjs.guide/sharding/#getting-started} */
const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("src/client/bot.js", {
  token: process.env.SECRET_TOKEN,
});

manager.on("shardCreate", (shard) => {
  console.log(`Shard ${shard.id} launched.`);
});

manager.spawn();
