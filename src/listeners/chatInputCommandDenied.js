"use strict";

const { Listener } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

class ChatInputCommandDenied extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: false,
      event: "chatInputCommandDenied",
    });
  }

  #build = (err) => {
    // TODO: Reflect.get()?
    // Check for precondition and return something.
    return `${err.message}.`;
  };

  #embed = (text) => {
    return new EmbedBuilder()
      .setColor("Red")
      .setTitle("Command Error!")
      .setDescription(text);
  };

  async run(exception, { interaction }) {
    try {
      const result = this.#build(exception);

      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ embeds: [this.#embed(result)] });
      } else {
        await interaction.reply({ embeds: [this.#embed(result)] });
      }
    } catch (error) {
      const result = `Listener[chatInputCommandDenied]: ${error.message}`;
      this.container.logger.error(result);
    }
  }
}

module.exports = { ChatInputCommandDenied };
