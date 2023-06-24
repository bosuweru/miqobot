"use strict";

const fs = require("node:fs");
const path = require("node:path");

const sinon = require("sinon");
const expect = require("chai").expect;

describe("src/client/commands/item.js", function () {
  let events;
  let interaction;

  after(function () {
    sinon.restore();
  });

  before(function () {
    const { Collection } = require("discord.js");

    events = require("../../../client/commands/item");
    interaction = require("./__mocks__/item.mock");
    interaction.client.datasets.set(events.data.name, new Collection());

    const jsonPath = path.join(__dirname, "../../../assets/data");
    const jsonList = fs
      .readdirSync(jsonPath)
      .filter((file) => file.endsWith(".json"));

    for (const json of jsonList) {
      const dataPath = path.join(jsonPath, json);
      const data = require(dataPath);

      if (json.includes("item")) {
        const collection = interaction.client.datasets.get("item");
        data.Results.forEach((item) => {
          if (item.Name) collection.set(item.ID, item.Name);
        });
      }
    }

    sinon.stub(events, "fetch").resolves(interaction.xivapi.item);
  });

  beforeEach(function () {
    if (!interaction.options)
      interaction.options = {
        getInteger(id) {
          return id === "id" ? interaction.xivapi.item.ID : 0;
        },
        getFocused() {
          return interaction.xivapi.item.Name;
        },
      };

    const collection = interaction.client.datasets.get(events.data.name);
    if (!collection.has(interaction.xivapi.item.ID))
      collection.set(interaction.xivapi.item.ID, interaction.xivapi.item.Name);
  });

  describe("Item 'execute'", function () {
    it("returns undefined if command is executed unsuccessfully", async function () {
      delete interaction["options"];

      const result = await events.execute(interaction);
      expect(result).to.be.undefined;
    });

    it("returns true if command is executed successfully from fetch", async function () {
      const result = await events.execute(interaction);
      expect(result).to.be.true;
    });

    it("returns true if command is executed successfully from cache", async function () {
      const result = await events.execute(interaction);
      expect(result).to.be.true;
    });

    it("returns true even if an item id is missing from the dataset", async function () {
      const collection = interaction.client.datasets.get(events.data.name);
      if (collection.has(interaction.xivapi.item.ID))
        collection.delete(interaction.xivapi.item.ID);

      const result = await events.execute(interaction);
      expect(result).to.be.true;
    });

    it("returns true even if an item description is missing from xivapi", async function () {
      const collection = interaction.client.xivcache.get(events.data.name);
      if (collection.has(interaction.xivapi.item.ID))
        collection.delete(interaction.xivapi.item.ID);

      sinon.restore();
      sinon.stub(events, "fetch").resolves({
        ID: interaction.xivapi.item.ID,
        Icon: interaction.xivapi.item.Icon,
        Name: interaction.xivapi.item.Name,
        IconHD: interaction.xivapi.item.IconHD,
        Description: "",
      });

      const result = await events.execute(interaction);
      expect(result).to.be.true;
    });

    it("returns true even if an item high-definition icon is missing from xivapi", async function () {
      const collection = interaction.client.xivcache.get(events.data.name);
      if (collection.has(interaction.xivapi.item.ID))
        collection.delete(interaction.xivapi.item.ID);

      sinon.restore();
      sinon.stub(events, "fetch").resolves({
        ID: interaction.xivapi.item.ID,
        Icon: interaction.xivapi.item.Icon,
        Name: interaction.xivapi.item.Name,
        IconHD: "",
        Description: interaction.xivapi.item.Description,
      });

      const result = await events.execute(interaction);
      expect(result).to.be.true;
    });

    it("returns true even if an item high-definition icon or icon is missing from xivapi", async function () {
      const collection = interaction.client.xivcache.get(events.data.name);
      if (collection.has(interaction.xivapi.item.ID))
        collection.delete(interaction.xivapi.item.ID);

      sinon.restore();
      sinon.stub(events, "fetch").resolves({
        ID: interaction.xivapi.item.ID,
        Icon: "",
        Name: interaction.xivapi.item.Name,
        IconHD: "",
        Description: interaction.xivapi.item.Description,
      });

      const result = await events.execute(interaction);
      expect(result).to.be.true;
    });
  });

  describe("Item 'autocomplete'", function () {
    it("returns true if command is autocompleted successfully", async function () {
      const result = await events.autocomplete(interaction);
      expect(result).to.be.true;
    });

    it("returns undefined if command is autocompleted unsuccessfully", async function () {
      delete interaction["options"];

      const result = await events.autocomplete(interaction);
      expect(result).to.be.undefined;
    });
  });
});
