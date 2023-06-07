"use strict";

const { Events } = require("discord.js");
const { Listener } = require("@sapphire/framework");

class Ready extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: Events.Ready,
    });
  }

  run(client) {
    const user = client.user.tag;
    this.container.logger.info(`Listener[ready] ${user} logged in.`);
  }
}

module.exports = { Ready };
