"use strict";

const Time = require("@sapphire/duration").Time;
const EmbedBuilder = require("discord.js").EmbedBuilder;
const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

const { logger } = require("../../utilities/winston");

class Command {
  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Measures RTT and websocket heartbeat.");
    this.cooldown = 3000 / Time.Second;
  }

  async execute(interaction) {
    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== "staging") {
      try {
        const response = await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Default")
              .setTitle("Ping")
              .setDescription("Pinging..."),
          ],
          ephemeral: false,
          fetchReply: true,
        });

        const ws = Math.round(interaction.client.ws.ping);
        const rtt = response.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle("Ping")
              // eslint-disable-next-line prettier/prettier
            .setDescription(`The round-trip time is ${rtt}ms, and the websocket heartbeat is ${ws}ms.`),
          ],
        });
      } catch (error) {
        logger.error(`${error.message}`);
      }
    } else {
      return null;
    }
  }
}

module.exports = { Command };
