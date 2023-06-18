"use strict";

const Events = require("discord.js").Events;

const { logger } = require("../../utilities/winston");

class Event {
  constructor() {
    this.name = Events.ClientReady;
    this.once = true;
  }

  async execute(client) {
    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== "staging") {
      logger.info(`${client.user.tag} has logged in.`);
    } else {
      return null;
    }
  }
}

module.exports = { Event };
