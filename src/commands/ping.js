"use strict";

const { Command } = require("@sapphire/framework");
const { isMessageInstance } = require("@sapphire/discord.js-utilities");

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

  async chatInputRun(interaction) {
    const message = await interaction.reply({
      content: `Pinging...`,
      ephemeral: true,
      fetchReply: true,
    });

    if (isMessageInstance(message)) {
      const ws = Math.round(this.container.client.ws.ping);
      const rtt = message.createdTimestamp - interaction.createdTimestamp;

      return interaction.editReply(`Pong 🏓! (RTT: ${rtt}ms. WS: ${ws}ms.)`);
    } else {
      return interaction.editReply("Failed to retrieve ping.");
    }
  }
}

module.exports = { Ping };
