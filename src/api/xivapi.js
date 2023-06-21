"use strict";

const { logger } = require("../utilities/winston");
const { request } = require("undici");

module.exports = {
  async fetchable(args, ...kwargs) {
    try {
      const url = `https://xivapi.com/${args}/${kwargs[0]}?private_key=${process.env.XIVAPI_PRIVATE_KEY}`;
      const req = await request(url);

      return await req.body.json();
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
};
