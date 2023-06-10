"use strict";

require("@sapphire/plugin-logger/register");
const { GatewayIntentBits } = require("discord.js");
const { LogLevel, container, SapphireClient } = require("@sapphire/framework");

class Miqobot {
  constructor() {
    this.client = new SapphireClient({
      intents: [GatewayIntentBits.Guilds],
      logger: {
        level:
          process.env.NODE_ENV === "production"
            ? /* istanbul ignore next */ LogLevel.Info
            : LogLevel.Debug,
      },
    });
  }

  connect() {
    this.client.login(process.env.SECRET_TOKEN).catch((error) => {
      /* istanbul ignore if  */
      if (process.env.NODE_ENV) {
        const result = error.message;
        container.logger.error(`Client[miqobot] ${result}`);
      }
    });
  }

  disconnect() {
    try {
      this.client.destroy();
    } catch (error) {
      /* istanbul ignore if  */
      if (process.env.NODE_ENV) {
        const result = error.message;
        container.logger.error(`Client[miqobot] ${result}`);
      }
    }
  }
}

module.exports = { Miqobot };

/* istanbul ignore if  */
if (process.env.NODE_ENV) {
  const miqobot = new Miqobot();
  miqobot.connect();
}
