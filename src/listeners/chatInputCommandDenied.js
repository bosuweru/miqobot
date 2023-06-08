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
    return `${err.message}.`;
  };

  #embed = (text) => {
    return new EmbedBuilder()
      .setColor("Red")
      .setTitle("Meow!")
      .setDescription(text);
  };

  async run(rejection, { interaction }) {
    try {
      const result = this.#build(rejection);

      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ embed: this.#embed(result) });
      } else {
        await interaction.reply({ embed: this.#embed(result) });
      }
    } catch (error) {
      const result = `Listener[chatInputCommandDenied]: ${error.message}`;
      this.container.logger.error(result);
    }
  }
}

module.exports = { ChatInputCommandDenied };
