"use strict";

const sinon = require("sinon");
const expect = require("chai").expect;
const command = require("../../../client/commands/item");

const { Collection } = require("discord.js");

describe("src/client/commands/item.js", function () {
  let datasets;
  let interaction;

  before(function () {
    datasets = new Collection();
    datasets.set("item", new Collection());

    const item = { ID: 1, Name: "Gil" };
    const collection = datasets.get("item");
    collection.set(item.ID, item.Name);
  });

  afterEach(function () {
    sinon.restore();
    for (const key in interaction) delete interaction[key];
  });

  beforeEach(function () {
    sinon.stub(command, "fetch").resolves({
      Name: "Gil",
      Icon: "/i/065000/065002.png",
      IconHD: "/i/065000/065002_hr1.png",
      Description: "Standard Eorzean currency.",
    });

    interaction = {
      client: {
        datasets: {
          get(string) {
            return datasets.get(string);
          },
        },
        xivcache: new Collection(),
      },
      options: {
        id: 1,
        getInteger() {
          return interaction.options.id;
        },
      },
      reply(object) {
        return object ? true : false;
      },
      editReply(object) {
        return object ? true : false;
      },
      deferReply() {
        return null;
      },
    };
  });

  describe("Item 'execute'", function () {
    it("returns true if chat input command is executed", async function () {
      let result = await command.execute(interaction);
      expect(result).to.be.true;

      result = await command.execute(interaction);
      expect(result).to.be.true;

      interaction.options.id = 0;
      result = await command.execute(interaction);
      expect(result).to.be.true;
    });

    it("returns undefined if chat input command is invalid", async function () {
      interaction.client = undefined;

      const result = await command.execute(interaction);
      expect(result).to.be.undefined;
    });
  });
});
