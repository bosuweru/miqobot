"use strict";

const { Collection } = require("discord.js");

// eslint-disable-next-line prettier/prettier
const { workflow } = require("../../../../assets/configuration/workflow.configuration.json");
const { xivapi } = workflow;

module.exports = {
  client: {
    datasets: new Collection(),
    xivcache: new Collection(),
  },
  xivapi: {
    item: {
      ID: xivapi.item.ID,
      Icon: xivapi.item.Icon,
      Name: xivapi.item.Name,
      IconHD: xivapi.item.IconHD,
      Description: xivapi.item.Description,
    },
  },
  options: {
    getInteger(id) {
      return id === "id" ? xivapi.item.ID : 0;
    },
    getFocused() {
      return xivapi.item.Name;
    },
  },
  reply(object) {
    return object ? true : false;
  },
  respond(object) {
    return object ? true : false;
  },
  editReply(object) {
    return object ? true : false;
  },
  deferReply() {
    return null;
  },
};
