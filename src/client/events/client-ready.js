"use strict";

const Events = require("discord.js").Events;

class Event {
  constructor() {
    this.name = Events.ClientReady;
    this.once = true;
  }

  async execute(client) {
    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== "staging") {
      console.log(`${client.user.tag} has logged in.`);
    } else {
      return null;
    }
  }
}

module.exports = { Event };
