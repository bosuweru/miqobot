"use strict";

const { logger } = require("../../utilities/winston");
const { request } = require("undici");
const { Second, Millisecond } = require("@sapphire/duration").Time;
const { Collection, EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Returns information about an item.")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("Enter the name of an item to search.")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  cooldown: 5000 / Second,
  build(item) {
    const title = item.Name;
    const thumbnail = item.IconHD ? item.IconHD : item.Icon;
    const description = item.Description;

    return new EmbedBuilder()
      .setColor("Green")
      .setTitle(title)
      .setFooter({ text: "XIVAPI", iconURL: "https://xivapi.com/favicon.png" })
      .setThumbnail("https://xivapi.com" + thumbnail || null)
      .setTimestamp()
      .setDescription(description || "No description provided.");
  },
  error() {
    return new EmbedBuilder()
      .setColor("Red")
      .setTitle("Error")
      .setDescription("Please use the autocomplete feature.");
  },
  async fetch(args, ...kwargs) {
    try {
      const url = `https://xivapi.com/${args}/${kwargs[0]}?private_key=${process.env.XIVAPI_PRIVATE_KEY}`;
      const req = await request(url);

      return await req.body.json();
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
  async execute(interaction) {
    try {
      if (!interaction.client.xivcache.has(this.data.name))
        interaction.client.xivcache.set(this.data.name, new Collection());

      const id = interaction.options.getInteger("id");
      const dataset = interaction.client.datasets.get(this.data.name);

      if (!dataset.has(id))
        return await interaction.reply({
          embeds: [this.error()],
          ephemeral: true,
          fetchReply: false,
        });

      const cache = interaction.client.xivcache.get(this.data.name);

      if (cache.has(id)) {
        const query = cache.get(id);

        return await interaction.reply({
          embeds: [this.build(query)],
          ephemeral: false,
          fetchReply: false,
        });
      }

      await interaction.deferReply();

      const delay = 1800000 * Millisecond;
      const query = await this.fetch(this.data.name, id);

      cache.set(id, query);
      setTimeout(() => cache.delete(id), delay);

      return await interaction.editReply({ embeds: [this.build(query)] });
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
  async autocomplete(interaction) {
    try {
      const focused = interaction.options.getFocused();
      const dataset = interaction.client.datasets.get(this.data.name);
      const choices = Array.from(dataset, ([key, value]) => ({ key, value }));

      const filtered = choices.filter((choice) =>
        choice.value.toLowerCase().startsWith(focused.toLowerCase())
      );

      return await interaction.respond(
        filtered
          .map((choice) => ({ name: choice.value, value: choice.key }))
          .slice(0, 25)
      );
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
};
