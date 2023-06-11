"use strict";

const { Time } = require("@sapphire/time-utilities");
const { Command } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

class Ping extends Command {
  constructor(context) {
    super(context, { cooldownDelay: Time.Second * 10 });
  }

  /* istanbul ignore next */
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ping")
        .setDescription("Measures RTT and websocket heartbeat.")
    );
  }

  /* istanbul ignore next */
  builder(response, interaction) {
    if (!response || !interaction) {
      return { color: "Default", title: "Ping", description: "Pinging..." };
    } else {
      const ws = Math.round(interaction.client.ws.ping);
      const rtt = response.createdTimestamp - interaction.createdTimestamp;

      return {
        color: "Green",
        title: "Ping",
        description: `The round-trip time is ${rtt}ms, and the websocket heartbeat is ${ws}ms.`,
      };
    }
  }

  /* istanbul ignore next */
  message(object) {
    return new EmbedBuilder()
      .setColor(object.color)
      .setTitle(object.title)
      .setDescription(object.description);
  }

  /* istanbul ignore next */
  async chatInputRun(interaction) {
    try {
      const response = await interaction.reply({
        embeds: [this.message(this.builder())],
        ephemeral: false,
        fetchReply: true,
      });
      await interaction.editReply({
        embeds: [this.message(this.builder(response, interaction))],
      });

      this.container.logger.debug(`Command[ping]: Executed successfully.`);
    } catch (error) {
      const result = `Command[ping]: ${error.message}`;
      this.container.logger.error(result);
    }
  }
}

module.exports = { Ping };
