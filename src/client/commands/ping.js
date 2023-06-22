"use strict";

const { logger } = require("../../utilities/winston");
const { Second } = require("@sapphire/duration").Time;
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

/* istanbul ignore next */
function onPing(message, interaction) {
  const ws = Math.round(interaction.client.ws.ping);
  const rtt = message.createdTimestamp - interaction.createdTimestamp;
  const description = `The round-trip time is ${rtt}ms, and the websocket heartbeat is ${ws}ms.`;

  return new EmbedBuilder()
    .setColor("Green")
    .setTitle("Ping")
    .setDescription(description);
}

function onWait() {
  return new EmbedBuilder()
    .setColor("Default")
    .setTitle("Ping")
    .setDescription("Pinging...");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Measures RTT and websocket heartbeat."),
  cooldown: 3000 / Second,
  async execute(interaction) {
    try {
      const message = await interaction.reply({
        embeds: [onWait()],
        ephemeral: false,
        fetchReply: true,
      });

      /* istanbul ignore next */
      return await interaction.editReply({
        embeds: [onPing(message, interaction)],
      });
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
};
