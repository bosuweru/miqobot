"use strict";

const Time = require("@sapphire/duration").Time;
const EmbedBuilder = require("discord.js").EmbedBuilder;
const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

const { fetch } = require("../../api/xivapi");
const { logger } = require("../../utilities/winston");

// Need to do something about this.
// Maybe make it possible to get the thumbnail from xivapi.js,
// since it's fetching here. Shouldn't be doing that here.
function item(result) {
  const title = result.Name;
  const thumbnail = result.IconHD
    ? `https://xivapi.com/${result.IconHD}?${process.env.XIV_API_KEY}`
    : `https://xivapi.com/${result.Icon}?${process.env.XIV_API_KEY}`;
  //const description = result.Description;

  return new EmbedBuilder()
    .setColor("Green")
    .setTitle(title)
    .setFooter({ text: "XIVAPI", iconURL: "https://xivapi.com/favicon.png" })
    .setThumbnail(thumbnail)
    .setTimestamp();
    //.setDescription(description);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xiv")
    .setDescription("Requests information from XIVAPI.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("item")
        .setDescription("Returns information about a specific item.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Enter an item's identification value.")
            .setRequired(true)
        )
    ),
  cooldown: 10000 / Time.Second,
  async execute(interaction) {
    try {
      await interaction.deferReply();

      if (interaction.options.getSubcommand() === "item") {
        const id = interaction.options.getString("id");
        const result = await fetch(interaction.options.getSubcommand(), id);

        // Some items aren't working.
        // Need to look into why.
        // Some items don't have descriptions??
        return await interaction.editReply({ embeds: [item(result)] });
      }
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`Command[${this.data.name}]: ${exception}`);
    }
  },
};
