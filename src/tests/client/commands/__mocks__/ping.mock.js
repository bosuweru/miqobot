"use strict";

// eslint-disable-next-line prettier/prettier
const { workflow } = require("../../../../assets/configuration/workflow.configuration.json");
const { interaction } = workflow;

module.exports = {
  client: { ws: { ping: interaction.client.ws.ping } },
  createdTimestamp: interaction.createdTimestamp,
  reply(object) {
    return object ? { createdTimestamp: this.createdTimestamp } : undefined;
  },
  editReply(object) {
    return object ? true : false;
  },
};
