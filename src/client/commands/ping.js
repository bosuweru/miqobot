"use strict";

const { logger } = require("../../utilities/winston");
const { Second } = require("@sapphire/duration").Time;
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Measures RTT and websocket heartbeat."),
  cooldown: 3000 / Second,
  onPing(message, interaction) {
    const ws = Math.round(interaction.client.ws.ping);
    const rtt = message.createdTimestamp - interaction.createdTimestamp;
    const description = `The round-trip time is ${rtt}ms, and the websocket heartbeat is ${ws}ms.`;

    return new EmbedBuilder()
      .setColor("Green")
      .setTitle("Ping")
      .setDescription(description);
  },
  onWait() {
    return new EmbedBuilder()
      .setColor("Default")
      .setTitle("Ping")
      .setDescription("Pinging...");
  },
  async execute(interaction) {
    try {
      const message = await interaction.reply({
        embeds: [this.onWait()],
        ephemeral: false,
        fetchReply: true,
      });

      return await interaction.editReply({
        embeds: [this.onPing(message, interaction)],
      });
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
};
