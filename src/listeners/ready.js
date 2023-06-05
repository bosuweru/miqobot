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
    this.container.logger.info(`${client.user.tag} logged in.`);
  }
}

module.exports = { Ready };
