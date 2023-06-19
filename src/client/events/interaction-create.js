"use strict";

const Time = require("@sapphire/duration").Time;
const Events = require("discord.js").Events;
const Collection = require("discord.js").Collection;
const EmbedBuilder = require("discord.js").EmbedBuilder;

const { logger } = require("../../utilities/winston");

function onCooldown(command, remaining) {
  const description = `You are on a cooldown for \`${command.data.name}\`. You can use it again <t:${remaining}:R>.`;

  return new EmbedBuilder()
    .setColor("Red")
    .setTitle("Slow down!")
    .setDescription(description);
}

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;
      if (!interaction.client.cooldown.has(command.data.name))
        interaction.client.cooldown.set(command.data.name, new Collection());

      const utc = Date.now();
      const cooldown = command.cooldown * Time.Second;
      const timestamps = interaction.client.cooldown.get(command.data.name);

      if (timestamps.has(interaction.user.id)) {
        const milliseconds = timestamps.get(interaction.user.id) + cooldown;

        if (utc < milliseconds) {
          const remaining = Math.round(milliseconds / Time.Second);

          return await interaction.reply({
            embeds: [onCooldown(command, remaining)],
            ephemeral: true,
          });
        }
      }

      timestamps.set(interaction.user.id, utc);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldown);

      return await command.execute(interaction);
    } catch (error) {
      logger.error(`[${this.name}]: ${error.message}`);
    }
  },
};
