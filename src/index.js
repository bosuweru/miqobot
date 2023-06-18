"use strict";

const path = require("node:path");
const ShardingManager = require("discord.js").ShardingManager;

const { logger } = require("./utilities/winston");

class Crystals {
  constructor(Crystal) {
    this.manager = new ShardingManager(Crystal, {
      mode: "process",
      token: process.env.SECRET_TOKEN,
      respawn: true,
      execArgv: ["--trace-warnings"],
      shardArgs: ["--ansi", "--color"],
      shardList: "auto",
      totalShards: "auto",
    });
  }

  spawn() {
    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== "staging") this.manager.spawn();

    return undefined;
  }

  setupListener() {
    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== "staging")
      this.manager.on("shardCreate", (shard) => {
        logger.info(`Shard ${shard.id} has been created.`);
      });

    return undefined;
  }
}

module.exports = { Crystals };

/* istanbul ignore next  */
if (process.env.NODE_ENV !== "staging") {
  const Client = path.join(__dirname, "client/crystal.js");
  const Shards = new Crystals(Client);

  Shards.setupListener();
  Shards.spawn();
}
