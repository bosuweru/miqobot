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

/* istanbul ignore if */
if (process.env.NODE_ENV !== "staging") {
  const rest = new REST().setToken(process.env.SECRET_TOKEN);

  if (process.env.NODE_ENV === "development") {
    // const { miqobot } = require("../../private/configuration/miqobot.json");
    // const { client, server } = miqobot;

    rest
      .put(Routes.applicationGuildCommands("1112420494411583488", "1112862228044066816"), {
        body: commands,
      })
      .then((data) => {
        const result = `${data.length} guild application (/) commands`;
        logger.info(`Script[deployment]: Refreshed ${result}.`);
      })
      .catch((error) => {
        const exception = `${error.message}`;
        logger.error(`Script[deployment]: ${exception}.`);
      });
  } else {
    const client = { id: process.env.APPLICATION_ID };

    rest
      .put(Routes.applicationCommands(client.id), {
        body: commands,
      })
      .then((data) => {
        const result = `${data.length} application (/) commands`;
        logger.info(`Script[deployment]: Refreshed ${result}.`);
      })
      .catch((error) => {
        const exception = `${error.message}`;
        logger.error(`Script[deployment]: ${exception}.`);
      });
  }
}
