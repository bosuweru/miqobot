"use strict";

const fs = require("node:fs");
const path = require("node:path");

const REST = require("discord.js").REST;
const Routes = require("discord.js").Routes;

class Deploy {
  constructor(directory) {
    this.commands = [];
    this.commandsPath = directory;
    this.commandFiles = fs
      .readdirSync(this.commandsPath)
      .filter((file) => file.endsWith(".js"));
  }

  load() {
    for (const file of this.commandFiles) {
      const commandPath = path.join(this.commandsPath, file);
      const { Command } = require(commandPath);

      const command = new Command();
      this.commands.push(command.data.toJSON());
    }
  }

  save() {
    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== "staging") {
      const rest = new REST().setToken(process.env.SECRET_TOKEN);

      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line prettier/prettier
        const { client, server } = require("../../private/configuration/miqobot.json");

        rest.put(Routes.applicationGuildCommands(client.id, server.id), {
          body: this.commands,
        });
      } else {
        const client = { id: process.env.APPLICATION_ID };

        rest.put(Routes.applicationCommands(client.id), {
          body: this.commands,
        });
      }
    } else {
      return null;
    }
  }
}

module.exports = { Deploy };

/* istanbul ignore next  */
if (process.env.NODE_ENV !== "staging") {
  const folder = path.join(__dirname, "../client/commands");
  const script = new Deploy(folder);

  script.load();
  script.save();
}
