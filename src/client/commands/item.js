"use strict";

const { logger } = require("../../utilities/winston");
const { request } = require("undici");
const { Second, Millisecond } = require("@sapphire/duration").Time;
const { Collection, EmbedBuilder, SlashCommandBuilder } = require("discord.js");

async function fetch(args, ...params) {
  try {
    const url = `https://xivapi.com/${args}/${params[0]}?private_key=${process.env.XIVAPI_PRIVATE_KEY}`;
    const req = await request(url);

    return await req.body.json();
  } catch (error) {
    const exception = `${error.message}`;
    logger.error(`${exception}`);
  }
}

function error() {
  return new EmbedBuilder()
    .setColor("Red")
    .setTitle("Error")
    .setDescription("Please use the autocomplete feature.");
}

function build(result) {
  return new EmbedBuilder()
    .setColor("Green")
    .setTitle(result.Name)
    .setFooter({ text: "XIVAPI", iconURL: "https://xivapi.com/favicon.png" })
    .setTimestamp()
    .setDescription(result.Description || "No description provided.");
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
  cooldown: 5000 / Second,
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
          embeds: [error()],
          ephemeral: true,
          fetchReply: false,
        });

      const delay = 3600000 * Millisecond;
      const items = interaction.client.xivcache.get(this.data.name);
      const query = data[0];

      if (items.has(query.id)) {
        const result = items.get(query.id);

        return await interaction.reply({
          embeds: [build(result)],
          ephemeral: false,
          fetchReply: false,
        });
      }

      await interaction.deferReply();

      const result = await fetch(this.data.name, query.id);
      items.set(query.id, result);
      setTimeout(() => items.delete(query.id), delay);

      return await interaction.editReply({ embeds: [build(result)] });
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
