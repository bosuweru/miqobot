"use strict";

const fs = require("node:fs");
const path = require("node:path");

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { logger } = require("../utils/pino");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandsFolders = fs.readdirSync(commandsPath);

for (const folder of commandsFolders) {
  const categoryPath = path.join(commandsPath, folder);
  const categoryFiles = fs
    .readdirSync(categoryPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of categoryFiles) {
    const filePath = path.join(categoryPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      logger.warn(`The command at ${filePath} is missing required properties.`);
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.on(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.SECRET_TOKEN);
