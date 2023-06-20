"use strict";

const request = require("undici").request;

const { logger } = require("../utilities/winston");

module.exports = {
  async fetch(category, id) {
    try {
      const url = `https://xivapi.com/${category}/${id}?${process.env.XIV_API_KEY}`;
      const req = await request(url);

      return await req.body.json();
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`XIVAPI[item]: ${exception}`);
    }
  },
};
