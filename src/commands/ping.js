"use strict";

const { Command } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

class Ping extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ping")
        .setDescription("Measures RTT and heartbeat socket.")
    );
  }

  #message(ws, rtt) {
    const color = 0x0000ff;
    const title = "/ping";

    if (!ws && !rtt) {
      const description = "Pinging...";

      return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setTimestamp()
        .setDescription(description);
    } else {
      const description = `The round-trip time is ${rtt}ms, and the websocket heartbeat is ${ws}ms.`;

      return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setTimestamp()
        .setDescription(description);
    }
  }

  async chatInputRun(interaction) {
    const result = await interaction.reply({
      embeds: [this.#message()],
      ephemeral: false,
      fetchReply: true,
    });

    const ws = Math.round(this.container.client.ws.ping);
    const rtt = result.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply({ embeds: [this.#message(ws, rtt)] });
  }
}

module.exports = { Ping };
