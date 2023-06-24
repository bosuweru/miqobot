"use strict";

const { Time } = require("@sapphire/duration");
const { Collection } = require("discord.js");

// eslint-disable-next-line prettier/prettier
const { miqobot } = require("../../../../assets/configuration/miqobot.configuration.json");

// eslint-disable-next-line prettier/prettier
const { workflow } = require("../../../../assets/configuration/workflow.configuration.json");
const { interaction } = workflow;

module.exports = {
  set: {
    commandName: "workflow",
    autocomplete: null,
    isChatInputCommand: null,
  },
  user: miqobot.client.development.id,
  client: {
    cooldown: new Collection(),
    commands: new Collection(),
  },
  command: {
    data: { name: interaction.command.data.name },
    cooldown: interaction.command.cooldown / Time.Second,
    execute(object) {
      return object ? true : false;
    },
    autocomplete(object) {
      return object ? true : false;
    },
  },
  commandName: interaction.commandName,
  reply(object) {
    return object ? false : true;
  },
  isAutocomplete() {
    return this.set.autocomplete;
  },
  isChatInputCommand() {
    return this.set.chatInputCommand;
  },
};
