"use strict";

const { Events } = require("discord.js");
const { logger } = require("../../utils/pino");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logger.info(`${client.user.tag} logged in.`);
  },
};
