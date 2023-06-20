"use strict";

const fs = require("node:fs");
const path = require("node:path");

const Client = require("discord.js").Client;
const Collection = require("discord.js").Collection;
const GatewayIntentBits = require("discord.js").GatewayIntentBits;

const { logger } = require("../utilities/winston");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cooldown = new Collection();
client.xivcache = new Collection();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const eventPath = path.join(eventsPath, file);
  const event = require(eventPath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  /* istanbul ignore else */
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    const warning = `"${filePath}" is missing a required "data" or "execute" property`;
    logger.warn(`Client[miqobot]: ${warning}.`);
  }
}

/* istanbul ignore if */
if (process.env.NODE_ENV !== "staging") client.login(process.env.SECRET_TOKEN);

module.exports = { client };
