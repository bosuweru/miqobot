"use strict";

const fs = require("node:fs");
const path = require("node:path");

const { load } = require("../utils/dotenv");
load();

/** @see {@link https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands} */
const { REST, Routes } = require("discord.js");
const { logger } = require("../utils/pino");

const { miqobot } = require("../../private/configuration/miqobot.json");
const { client, server } = miqobot;

const commands = [];
const commandsPath = path.join(__dirname, "../client/commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith("js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    logger.warn(`The command at ${filePath} is missing required properties.`);
  }
}

const rest = new REST().setToken(process.env.SECRET_TOKEN);

(async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      const data = await rest.put(
        Routes.applicationGuildCommands(client.id, server.id),
        {
          body: commands,
        }
      );

      logger.info(`Refreshed ${data.length} server application (/) commands.`);
    } else {
      const data = await rest.put(Routes.applicationCommands(client.id), {
        body: commands,
      });

      logger.info(`Refreshed ${data.length} global application (/) commands.`);
    }
  } catch (error) {
    logger.error(error);
  }
})();
