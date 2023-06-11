"use strict";

const Events = require("discord.js").Events;

class Event {
  constructor() {
    this.name = Events.InteractionCreate;
    this.once = false;
  }

  execute() {
    return null;
  }
}

module.exports = { Event };
