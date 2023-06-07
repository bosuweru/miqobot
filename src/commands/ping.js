"use strict";

const { Time } = require("@sapphire/time-utilities");
const { Command } = require("@sapphire/framework");
const { bold, EmbedBuilder } = require("discord.js");

class Ping extends Command {
  constructor(context) {
    super(context, { cooldownDelay: Time.Second * 10 });
  }

  #build = (int, res) => {
    const ws = bold(`${Math.round(int.client.ws.ping)}ms`);
    const rtt = bold(`${res.createdTimestamp - int.createdTimestamp}ms`);
    const emoji = ":ping_pong:";

    return `${emoji} The round-trip time is ${rtt}, and the websocket heartbeat is ${ws}.`;
  };

  #embed = (text) => {
    return new EmbedBuilder().setColor("Default").setDescription(text);
  };

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ping")
        .setDescription("Measures RTT and websocket heartbeat.")
    );
  }

  async chatInputRun(interaction) {
    try {
      const result = await interaction.reply({
        embeds: [this.#embed("Pinging...")],
        ephemeral: false,
        fetchReply: true,
      });

      const description = this.#build(interaction, result);
      await interaction.editReply({ embeds: [this.#embed(description)] });
      this.container.logger.debug(`Command[ping]: Executed successfully.`);
    } catch (error) {
      const result = error.message;
      this.container.logger.error(`Command[ping]: ${result}`);
    }
  }
}

module.exports = { Ping };
