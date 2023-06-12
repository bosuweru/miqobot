"use strict";

if (process.env.NODE_ENV !== "staging") {
  const fs = require("node:fs");
  const path = require("node:path");

  const REST = require("discord.js").REST;
  const Routes = require("discord.js").Routes;

  const commands = [];
  const commandsPath = path.join(__dirname, "../client/commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const commandPath = path.join(commandsPath, file);
    const { Command } = require(commandPath);

    const command = new Command();
    commands.push(command.data.toJSON());
  }

  const rest = new REST().setToken(process.env.SECRET_TOKEN);

  if (process.env.NODE_ENV === "development") {
    const { miqobot } = require("../../private/configuration/miqobot.json");

    const client = miqobot.client;
    const server = miqobot.server;

    rest
      .put(Routes.applicationGuildCommands(client.id, server.id), {
        body: commands,
      })
      .then((data) => {
        const result = `Successfully reloaded ${data.length} application (/) commands.`;
        console.log(result);
      });
  } else {
    const client = { id: process.env.CLIENT_ID };

    rest
      .put(Routes.applicationCommands(client.id), { body: commands })
      .then((data) => {
        const result = `Successfully reloaded ${data.length} application (/) commands.`;
        console.log(result);
      });
  }
}
