"use strict";

const fs = require("node:fs");
const path = require("node:path");

const { logger } = require("../utilities/winston");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cooldown = new Collection();
client.datasets = new Collection();
client.xivcache = new Collection();

client.datasets.set("item", new Collection());

const jsonPath = path.join(__dirname, "../../private/data");
const jsonList = fs
  .readdirSync(jsonPath)
  .filter((file) => file.endsWith(".json"));

for (const json of jsonList) {
  const dataPath = path.join(jsonPath, json);
  const data = require(dataPath);

  if (json.includes("item")) {
    const collection = client.datasets.get("item");
    data.Results.forEach((item) => {
      if (item.Name) collection.set(item.ID, item.Name);
    });
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) client.once(event.name, (...args) => event.execute(...args));
  else client.on(event.name, (...args) => event.execute(...args));
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
    const warning = `"${filePath}" is missing a required "data" or "execute" property.`;
    logger.warn(`${warning}`);
  }
}

client.login(process.env.SECRET_TOKEN).catch((error) => {
  const exception = `${error.message}`;
  logger.error(`${exception}`);
});

module.exports = { client };
