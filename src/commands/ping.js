"use strict";

const { Command } = require("@sapphire/framework");
const { bold, EmbedBuilder } = require("discord.js");

class Ping extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  #embed = (text) => {
    return new EmbedBuilder().setDescription(text);
  };

  #print = (int, res) => {
    const e = ":ping_pong:";
    const ws = bold(`${Math.round(int.client.ws.ping)}ms`);
    const rtt = bold(`${res.createdTimestamp - int.createdTimestamp}ms`);

    return `${e} The round-trip time is ${rtt}, and the websocket heartbeat is ${ws}.`;
  };

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ping")
        .setDescription("Measures RTT and websocket heartbeat.")
    );
  }

  async chatInputRun(interaction) {
    this.container.logger.debug(`${interaction.user.tag} used /ping!`);

    const result = await interaction.reply({
      embeds: [this.#embed("Pinging...")],
      ephemeral: false,
      fetchReply: true,
    });

    const string = this.#print(interaction, result);
    await interaction.editReply({ embeds: [this.#embed(string)] });

    this.container.logger.debug(string);
  }
}

module.exports = { Ping };
