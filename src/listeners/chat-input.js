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

  builder(precondition) {
    /* istanbul ignore else  */
    if (precondition.identifier === "preconditionCooldown") {
      const value = Math.floor(precondition.context.remaining / Time.Second);
      const clock = () => {
        if (value > 1) return `${value} seconds`;
        else if (value == 1) return `${value} second`;
        else return `${precondition.context.remaining / Time.Second} seconds`;
      };
      const embed = {
        color: "Red",
        title: "Slow down!",
        description: `You will be able to use this command again in ${clock()}.`,
      };

      return embed;
    }
  }

  message(object) {
    return new EmbedBuilder()
      .setColor(object.color)
      .setTitle(object.title)
      .setDescription(object.description);
  }

  async run(precondition, { interaction }) {
    /* istanbul ignore if  */
    if (process.env.NODE_ENV) {
      try {
        const result = this.builder(precondition);

        if (interaction.replied || interaction.deferred) {
          await interaction.editReply({ embeds: [this.message(result)] });
        } else {
          await interaction.reply({ embeds: [this.message(result)] });
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
}

module.exports = { ChatInputCommandDenied };
