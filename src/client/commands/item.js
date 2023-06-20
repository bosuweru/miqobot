"use strict";

const Time = require("@sapphire/duration").Time;
const EmbedBuilder = require("discord.js").EmbedBuilder;
const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

const { fetch } = require("../../api/xiv-item");
const { logger } = require("../../utilities/winston");

function onItem(data) {
  return new EmbedBuilder()
    .setColor("Green")
    .setTitle(data.title)
    .setFooter({ text: "XIVAPI", iconURL: "https://xivapi.com/favicon.png" })
    .setThumbnail(data.thumbnail)
    .setTimestamp()
    .setDescription(data.description);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Returns information about a specific item via XIVAPI.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Enter an item's identification value to query.")
        .setRequired(true)
    ),
  cooldown: 10000 / Time.Second,
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const id = interaction.options.getString("id");
      const data = await fetch(id);

      return await interaction.editReply({ embeds: [onItem(data)] });
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`Command[${this.data.name}]: ${exception}`);
    }
  },
};
