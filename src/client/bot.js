"use strict";

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", (client) => {
  console.log(`${client.user.tag} logged in.`);
});

client.login(process.env.SECRET_TOKEN);
