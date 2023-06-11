"use strict";

const fs = require("node:fs");
const path = require("node:path");

const Client = require("discord.js").Client;
const Collection = require("discord.js").Collection;
const GatewayIntentBits = require("discord.js").GatewayIntentBits;

class Crystal {
  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.collection = [];
  }

  setupEvent() {
    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const eventPath = path.join(eventsPath, file);
      const { Event } = require(eventPath);

      const event = new Event();
      this.client.events.set(`${event.name}`, event);

      if (event.once) {
        // eslint-disable-next-line prettier/prettier
        this.client.once(event.name, /* istanbul ignore next */ (...args) => event.execute(...args));
      } else {
        // eslint-disable-next-line prettier/prettier
        this.client.on(event.name, /* istanbul ignore next */ (...args) => event.execute(...args));
      }
    }
  }

  setupCollection() {
    this.client.events = new Collection();
    this.client.commands = new Collection();
    this.client.cooldowns = new Collection();

    this.collection.push(this.client.events);
    this.collection.push(this.client.commands);
    this.collection.push(this.client.cooldowns);
  }
}

module.exports = { Crystal };
