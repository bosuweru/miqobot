"use strict";

const cron = require("node-cron");

const { logger } = require("../utilities/winston");
const { request } = require("undici");

module.exports = {
  /* istanbul ignore next */
  cronJobs(client) {
    if (process.env.NODE_ENV !== "workflow") {
      // eslint-disable-next-line prettier/prettier
      cron.schedule("0 10 * * *", async () => {
          try {
            await this.items(client);
          } catch (error) {
            const exception = `${error.message}`;
            logger.error(`${exception}`);
          }
          // eslint-disable-next-line prettier/prettier
      }, { timezone: "Etc/UTC" });
    }
  },
  /* istanbul ignore next */
  async items(client) {
    const datasets = client.datasets.get("item");
    const xivcache = client.xivcache.get("item");

    try {
      const limit = 3000;
      const columns = "ID,Name";

      let url = `https://xivapi.com/item?limit=${limit}&columns=${columns}&private_key=${process.env.XIVAPI_PRIVATE_KEY}`;
      let req = await request(url);
      let res = await req.body.json();

      let milliseconds = 30000;

      // eslint-disable-next-line prettier/prettier
      for (let i = res.Pagination.Page; i <= res.Pagination.PageTotal; i++) {
        setTimeout(async () => {
          res.Results.forEach((item) => {
            if (item.Name) {
              datasets.set(item.ID, item.Name);
              if (xivcache.has(item.ID)) xivcache.delete(item.ID);
            }
          });

          if (res.Pagination.Page != res.Pagination.PageTotal) {
            url = `https://xivapi.com/item?page=${res.Pagination.PageNext}&limit=${limit}&columns=${columns}&private_key=${process.env.XIVAPI_PRIVATE_KEY}`;
            req = await request(url);
            res = await req.body.json();
          }
        }, milliseconds);

        milliseconds = milliseconds + 30000;
      }
    } catch (error) {
      const exception = `${error.message}`;
      logger.error(`${exception}`);
    }
  },
};
