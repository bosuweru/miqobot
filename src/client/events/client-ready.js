"use strict";

const Events = require("discord.js").Events;

const { logger } = require("../../utilities/winston");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logger.info(`Event[${this.name}]: ${client.user.tag} has been logged in.`);
  },
};
