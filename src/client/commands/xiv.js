"use strict";

const Time = require("@sapphire/duration").Time;
const EmbedBuilder = require("discord.js").EmbedBuilder;
const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

const request = require("undici").request;

const { logger } = require("../../utilities/winston");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xiv")
    .setDescription("Requests information from XIVAPI.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("item")
        .setDescription("Returns information about a specific item.")
    ),
  cooldown: 10000 / Time.Second,
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const result = await request(
        `https://xivapi.com/item/1?private_key=${process.env.XIV_API_KEY}`
      );
      const data = await result.body.json();

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle(data.Name)
            .setFooter({
              text: "XIVAPI",
              iconURL: "https://xivapi.com/favicon.png",
            })
            .setDescription(data.Description)
            .setThumbnail(`https://xivapi.com${data.IconHD}`),
        ],
      });
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`Command[${this.name}]: ${exception}`);
    }
  },
};
