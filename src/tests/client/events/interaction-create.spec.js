"use strict";

const expect = require("chai").expect;
const events = require("../../../client/events/interaction-create");
const params = require("./__mocks__/interaction-create.mock");

describe("src/client/events/interaction-create.js", function () {
  beforeEach(function () {
    if (!params.client.commands.has(params.command.data.name))
      params.client.commands.set(params.command.data.name, params.command);
  });

  describe("InteractionCreate 'execute'", function () {
    it("returns true if command is executed successfully", async function () {
      params.set.autocomplete = false;
      params.set.chatInputCommand = true;

      const result = await events.execute(params);
      expect(result).to.be.true;
    });

    it("returns true if command is autocompleted successfully", async function () {
      params.set.autocomplete = true;
      params.set.chatInputCommand = false;

      const result = await events.execute(params);
      expect(result).to.be.true;
    });

    it("returns false if command is executed during cooldown period", async function () {
      params.set.autocomplete = false;
      params.set.chatInputCommand = true;

      const result = await events.execute(params);
      expect(result).to.be.false;
    });

    it("returns undefined if command is invalid or missing during execution", async function () {
      params.set.autocomplete = false;
      params.set.chatInputCommand = true;
      params.client.commands.delete(params.command.data.name);

      const result = await events.execute(params);
      expect(result).to.be.undefined;
    });

    it("returns undefined if command is invalid or missing during autocompletion", async function () {
      params.set.autocomplete = true;
      params.set.chatInputCommand = false;
      params.client.commands.delete(params.command.data.name);

      const result = await events.execute(params);
      expect(result).to.be.undefined;
    });
  });
});
