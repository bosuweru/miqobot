"use strict";

const Time = require("@sapphire/duration").Time;
const Events = require("discord.js").Events;
const Collection = require("discord.js").Collection;
const EmbedBuilder = require("discord.js").EmbedBuilder;

class Event {
  constructor() {
    this.name = Events.InteractionCreate;
    this.once = false;
  }

  async execute(interaction) {
    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== "staging") {
      if (!interaction.isChatInputCommand()) return null;
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return undefined;
      if (!interaction.client.cooldowns.has(command.data.name))
        interaction.client.cooldowns.set(command.data.name, new Collection());

      const now = Date.now();
      const cooldown = command.cooldown * Time.Second;
      const timestamps = interaction.client.cooldowns.get(command.data.name);

      if (timestamps.has(interaction.user.id)) {
        const expiration = timestamps.get(interaction.user.id) + cooldown;

        if (now < expiration) {
          const expired = Math.round(expiration / Time.Second);
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle("Slow down!")
                // eslint-disable-next-line prettier/prettier
                .setDescription(`This command is on cooldown. You can use it again <t:${expired}:R>.`),
            ],
            ephemeral: true,
            fetchReply: false,
          });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldown);

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    } else {
      return null;
    }
  }
}

module.exports = { Event };
