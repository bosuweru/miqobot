"use strict";

const { Command } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

class Ping extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  #build = (int, res) => {
    const ws = `${Math.round(int.client.ws.ping)}ms`;
    const rtt = `${res.createdTimestamp - int.createdTimestamp}ms`;

    return `The round-trip time is ${rtt}, and the websocket heartbeat is ${ws}.`;
  };

  #embed = (description) => {
    return new EmbedBuilder().setDescription(`${description}`);
  };

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ping")
        .setDescription("Measures RTT and websocket heartbeat.")
    );
  }

  async chatInputRun(interaction) {
    const result = await interaction.reply({
      embeds: [this.#embed("Pinging...")],
      ephemeral: false,
      fetchReply: true,
    });

    await interaction.editReply({
      embeds: [this.#embed(this.#build(interaction, result))],
    });
  }
}

module.exports = { Ping };
