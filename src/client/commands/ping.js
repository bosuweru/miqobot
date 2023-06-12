"use strict";

const Time = require("@sapphire/duration").Time;
const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

class Command {
  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Measures RTT and websocket heartbeat.");
    this.cooldown = 3000 / Time.Second;
  }

  async execute() {
    return null;
  }
}

module.exports = { Command };
