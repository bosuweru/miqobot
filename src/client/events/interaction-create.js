"use strict";

const { logger } = require("../../utilities/winston");
const { Second } = require("@sapphire/duration").Time;
const { Events, Collection, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  onCooldown(command, remaining) {
    const description = `You are on a cooldown for \`${command.data.name}\`. You can use it again <t:${remaining}:R>.`;

    return new EmbedBuilder()
      .setColor("Red")
      .setTitle("Slow down!")
      .setDescription(description);
  },
  async execute(interaction) {
    try {
      if (interaction.isAutocomplete()) {
        const { commandName } = interaction;
        const command = interaction.client.commands.get(commandName);

        if (!command) return;

        return await command.autocomplete(interaction);
      }

      if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;
        const command = interaction.client.commands.get(commandName);

        if (!command) return;
        if (!interaction.client.cooldown.has(command.data.name))
          interaction.client.cooldown.set(command.data.name, new Collection());

        const utc = Date.now();
        const cooldown = command.cooldown * Second;
        const timestamps = interaction.client.cooldown.get(command.data.name);

        if (timestamps.has(interaction.user.id)) {
          const milliseconds = timestamps.get(interaction.user.id) + cooldown;

          /* istanbul ignore else */
          if (utc < milliseconds) {
            const remaining = Math.round(milliseconds / Second);

            return await interaction.reply({
              embeds: [this.onCooldown(command, remaining)],
              ephemeral: true,
              fetchReply: false,
            });
          }
        }

        timestamps.set(interaction.user.id, utc);

        /* istanbul ignore if */
        if (process.env.NODE_ENV !== "workflow")
          setTimeout(() => timestamps.delete(interaction.user.id), cooldown);

        return await command.execute(interaction);
      }
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
};
