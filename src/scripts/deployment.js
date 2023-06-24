"use strict";

const fs = require("node:fs");
const path = require("node:path");

const REST = require("discord.js").REST;
const Routes = require("discord.js").Routes;

const { logger } = require("../utilities/winston");

const commands = [];
const commandsPath = path.join(__dirname, "../client/commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const commandPath = path.join(commandsPath, file);
  const command = require(commandPath);

  commands.push(command.data.toJSON());
}

// eslint-disable-next-line prettier/prettier
const { miqobot } = require("../assets/configuration/miqobot.configuration.json");
const { guild, client } = miqobot;

/* istanbul ignore if */
if (process.env.NODE_ENV !== "workflow") {
  const rest = new REST().setToken(process.env.SECRET_TOKEN);

  if (process.env.NODE_ENV === "development") {
    rest
      .put(Routes.applicationGuildCommands(client.development.id, guild.id), {
        body: commands,
      })
      .then((data) => {
        const result = `Refreshed ${data.length} guild application commands`;
        logger.info(`${result}.`);
      })
      .catch((error) => {
        const exception = `${error.message}`;
        logger.error(`${exception}.`);
      });
  } else {
    rest
      .put(Routes.applicationCommands(client.production.id), {
        body: commands,
      })
      .then((data) => {
        const result = `Refreshed ${data.length} application commands`;
        logger.info(`${result}.`);
      })
      .catch((error) => {
        const exception = `${error.message}`;
        logger.error(`${exception}.`);
      });
  }
}
