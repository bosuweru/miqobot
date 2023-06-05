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
    const result = await interaction.reply({
      content: "Pinging...",
      ephemeral: true,
      fetchReply: true,
    });

    const ws = interaction.client.ws.ping;
    const rtt = result.createdTimestamp - interaction.createdTimestamp;

    await interaction.deleteReply();

    const message = new EmbedBuilder()
      .setColor(0x0000ff)
      .setTitle(":ping_pong: Pong!")
      .setTimestamp()
      .setDescription(
        `The round-trip time is ${rtt}ms, and the websocket heartbeat is ${ws}ms.`
      );

    await interaction.reply({ embeds: [message] });
  }
}

module.exports = { Ping };
