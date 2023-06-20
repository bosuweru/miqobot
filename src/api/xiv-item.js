"use strict";

const request = require("undici").request;

const { logger } = require("../utilities/winston");

module.exports = {
  async fetch(id) {
    try {
      const url = `https://xivapi.com/item/${id}?${process.env.XIV_API_KEY}`;
      const req = await request(url);
      const res = await req.body.json();

      const title = res.Name || "NaN";
      const thumbnail = res.IconHD
        ? `https://xivapi.com/${res.IconHD}?${process.env.XIV_API_KEY}`
        : `https://xivapi.com/${res.Icon}?${process.env.XIV_API_KEY}`;
      const description = res.Description || "No description available.";

      return { title: title, thumbnail: thumbnail, description: description };
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`XIVAPI[item]: ${exception}`);
    }
  },
};
