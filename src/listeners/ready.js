"use strict";

const { Listener } = require("@sapphire/framework");

class ReadyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: "ready",
    });
  }

  run(client) {
    const { username, discriminator } = client.user;
    this.container.logger.info(`${username}${discriminator} logged in.`);
  }
}

module.exports = { ReadyListener };
