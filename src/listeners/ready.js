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
    const { username, discriminator } = client.user;
    this.container.logger.info(`${username}#${discriminator} logged in.`);
  }
}

module.exports = { Ready };
