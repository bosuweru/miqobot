"use strict";

const { Time } = require("@sapphire/time-utilities");
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

  #build = (pre) => {
    if (pre.identifier === "preconditionCooldown") {
      const val = Math.floor(pre.context.remaining / Time.Second);
      const sec = () => {
        if (val > 1) return `${val} seconds`;
        else if (val == 1) return `${val} second`;
        else return `${pre.context.remaining / Time.Second} seconds`;
      };
      const obj = {
        title: "Slow down!",
        description: `You will be able to use this command again in ${sec()}.`,
      };

      return obj;
    }
  };

  #embed = (object) => {
    return new EmbedBuilder()
      .setColor("Red")
      .setTitle(object.title)
      .setDescription(object.description);
  };

  async run(precondition, { interaction }) {
    try {
      const result = this.#build(precondition);

      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ embeds: [this.#embed(result)] });
      } else {
        await interaction.reply({ embeds: [this.#embed(result)] });
      }

      this.container.logger.debug(
        `Listener[chatInputCommandDenied]: ${result.description}`
      );
    } catch (error) {
      const result = `Listener[chatInputCommandDenied]: ${error.message}`;
      this.container.logger.error(result);
    }
  }
}

module.exports = { ChatInputCommandDenied };
