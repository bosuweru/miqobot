"use strict";

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Measures RTT and websocket heartbeat."),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    interaction.editReply(
      `:stopwatch: RTT: ${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms\n:heart: Websocket Heartbeat: ${interaction.client.ws.ping}ms`
    );
  },
};
