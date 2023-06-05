"use strict";

const { Command } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

class Ping extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ping")
        .setDescription("Measures RTT and heartbeat socket.")
    );
  }

  async chatInputRun(interaction) {
    const message = new EmbedBuilder();
  }
}

module.exports = { Ping };
