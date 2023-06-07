"use strict";

require("@sapphire/plugin-logger/register");
const { GatewayIntentBits } = require("discord.js");
const { LogLevel, container, SapphireClient } = require("@sapphire/framework");

const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds],
  logger: {
    level:
      process.env.NODE_ENV === "development" ? LogLevel.Debug : LogLevel.Info,
  },
});

client.login(process.env.SECRET_TOKEN).catch((error) => {
  const result = error.message;
  container.logger.error(`Miqobot[index] ${result}`);
});
