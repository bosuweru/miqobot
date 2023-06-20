"use strict";

const request = require("undici").request;

const { logger } = require("../utilities/winston");

module.exports = {
  async fetch() {
    try {
      const url = `https://xivapi.com/item?${process.env.XIV_API_KEY}`;
      const req = await request(url);
      const res = await req.body.json();

      return res;
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`API[xiv]: ${exception}`);
    }
  },
};
