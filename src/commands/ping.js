"use strict";

const { Command } = require("@sapphire/framework");
const { bold, EmbedBuilder } = require("discord.js");

class Ping extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  #build = (int, res) => {
    const e = ":ping_pong:";
    const ws = bold(`${Math.round(int.client.ws.ping)}ms`);
    const rtt = bold(`${res.createdTimestamp - int.createdTimestamp}ms`);

    return `${e} The round-trip time is ${rtt}, and the websocket heartbeat is ${ws}.`;
  };

  #embed = (text) => {
    return new EmbedBuilder().setDescription(text);
  };

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ping")
        .setDescription("Measures RTT and websocket heartbeat.")
    );
  }

  async chatInputRun(interaction) {
    const user = interaction.user.tag;
    this.container.logger.debug(`Command[ping]: ${user} used /ping!`);

    try {
      const result = await interaction.reply({
        embeds: [this.#embed("Pinging...")],
        ephemeral: false,
        fetchReply: true,
      });

      const description = this.#build(interaction, result);
      await interaction.editReply({ embeds: [this.#embed(description)] });
    } catch (error) {
      const result = error.message;
      this.container.logger.error(`Command[ping]: ${result}`);
    }
  }
}

module.exports = { Ping };
