"use strict";

const { logger } = require("../../utilities/winston");
const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    try {
      logger.info(`${client.user.tag} logged in.`);
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
};
