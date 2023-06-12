"use strict";

const Events = require("discord.js").Events;

class Event {
  constructor() {
    this.name = Events.InteractionCreate;
    this.once = false;
  }

  async execute() {
    return null;
  }
}

module.exports = { Event };
