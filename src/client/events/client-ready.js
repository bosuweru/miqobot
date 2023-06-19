"use strict";

const Events = require("discord.js").Events;

const { logger } = require("../../utilities/winston");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    try {
      const { user } = client;
      logger.info(`Event[${this.name}]: ${user.tag} has been logged in.`);
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`Event[${this.name}]: ${exception}`);
    }
  },
};
