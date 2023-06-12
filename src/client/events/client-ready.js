"use strict";

const Events = require("discord.js").Events;

class Event {
  constructor() {
    this.name = Events.ClientReady;
    this.once = true;
  }

  async execute() {
    return null;
  }
}

module.exports = { Event };
