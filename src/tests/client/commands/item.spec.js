"use strict";

const { Collection } = require("discord.js");

const sinon = require("sinon");
const expect = require("chai").expect;
const events = require("../../../client/commands/item");
const params = require("./__mocks__/item.mock");

describe("src/client/commands/item.js", function () {
  after(function () {
    sinon.restore();
  });

  before(function () {
    sinon.stub(events, "fetch").resolves(params.xivapi.item);
    params.client.datasets.set(events.data.name, new Collection());
  });

  beforeEach(function () {
    const collection = params.client.datasets.get(events.data.name);
    if (!collection.has(params.xivapi.item.ID))
      collection.set(params.xivapi.item.ID, params.xivapi.item.Name);

    const { Icon, IconHD, Description } = params.xivapi.item;
    if (!Icon || !IconHD || !Description) params.xivapi.item = events.fetch();
  });

  describe("Item 'execute'", function () {
    it("returns true if command is executed successfully", async function () {
      /** This retrieves the item from {@link https://xivapi.com/ | XIVAPI}. */
      let result = await events.execute(params);
      expect(result).to.be.true;

      /** This retrieves the item from cache. */
      result = await events.execute(params);
      expect(result).to.be.true;

      /** This simulates an item without a description or high-definition icon. */
      params.xivapi.item.IconHD = null;
      params.xivapi.item.Description = null;
      result = await events.execute(params);
      expect(result).to.be.true;

      /** This simulates an item without an icon. */
      params.xivapi.item.Icon = null;
      result = await events.execute(params);
      expect(result).to.be.true;

      /** This simulates a user entering free text.  */
      const collection = params.client.datasets.get(events.data.name);
      if (collection.has(params.xivapi.item.ID))
        collection.delete(params.xivapi.item.ID);

      result = await events.execute(params);
      expect(result).to.be.true;
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("returns undefined if command is executed unsuccessfully", async function () {
      const result = await events.execute(undefined);
      expect(result).to.be.undefined;
    });
  });

  describe("Item 'autocomplete'", function () {
    it("returns true if command is executed successfully", async function () {
      const result = await events.autocomplete(params);
      expect(result).to.be.true;
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("returns undefined if command is executed unsuccessfully", async function () {
      const result = await events.autocomplete(undefined);
      expect(result).to.be.undefined;
    });
  });
});
