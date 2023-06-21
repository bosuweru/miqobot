"use strict";

const { logger } = require("../../utilities/winston");
const { fetchable } = require("../../api/xivapi");
const { Second, Millisecond } = require("@sapphire/duration").Time;
const { Collection, EmbedBuilder, SlashCommandBuilder } = require("discord.js");

function nya() {
  return new EmbedBuilder()
    .setColor("Red")
    .setTitle("Nya?!")
    .setDescription("I can't seem to find any information about that item.");
}

function meow(result) {
  return new EmbedBuilder()
    .setColor("Green")
    .setTitle(result.Name)
    .setFooter({ text: "XIVAPI", iconURL: "https://xivapi.com/favicon.png" })
    .setThumbnail(
      `https://xivapi.com${result.IconHD}?private_key=${process.env.XIVAPI_PRIVATE_KEY}`
    )
    .setTimestamp()
    .setDescription(result.Description);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Returns information about an item.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of an item to search.")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  cooldown: 10000 / Second,
  async execute(interaction) {
    try {
      if (!interaction.client.xivcache.has(this.data.name))
        interaction.client.xivcache.set(this.data.name, new Collection());

      const data = [];
      const name = interaction.options.getString("name");
      const list = interaction.client.datasets.get("item");
      list.forEach((value, key) => {
        if (name.localeCompare(value, "en", { sensitivity: "accent" }) == 0)
          data.push({ id: key, name: value });
      });

      if (!data.length)
        return await interaction.reply({
          embeds: [nya()],
          ephemeral: true,
          fetchReply: false,
        });

      const delay = 3600000 * Millisecond;
      const items = interaction.client.xivcache.get(this.data.name);
      const query = data[0];

      if (items.has(query.id)) {
        const result = items.get(query.id);
        return await interaction.reply({
          embeds: [meow(result)],
          ephemeral: false,
          fetchReply: false,
        });
      }

      await interaction.deferReply();
      const result = await fetchable(this.data.name, query.id);

      items.set(query.id, result);
      setTimeout(() => items.delete(query.id), delay);

      return await interaction.editReply({ embeds: [meow(result)] });
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
  async autocomplete(interaction) {
    try {
      const focused = interaction.options.getFocused();
      const dataset = interaction.client.datasets.get("item");
      const choices = Array.from(dataset.values());

      const filtered = choices.filter((choice) => choice.startsWith(focused));

      return await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25)
      );
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
};
