"use strict";

const Time = require("@sapphire/duration").Time;
const Collection = require("discord.js").Collection;
const EmbedBuilder = require("discord.js").EmbedBuilder;
const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

const { logger } = require("../../utilities/winston");

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
      const id = interaction.options.getString("id");

      if (!interaction.client.xivcache.has(this.data.name))
        interaction.client.xivcache.set(this.data.name, new Collection());

      const expiration = 3600000 * Time.Millisecond;
      const collection = interaction.client.xivcache.get(this.data.name);

      if (collection.has(id))
        return await interaction.reply({
          content: `${collection.get(id).title}`,
        });

      collection.set(interaction.options.getString("id"), { title: "Cached!" });
      setTimeout(() => collection.delete(id), expiration);

      await interaction.deferReply();

      return await interaction.editReply({ content: "Fetched!" });
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`Command[${this.data.name}]: ${exception}`);
    }
  },
};
