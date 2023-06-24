"use strict";

const expect = require("chai").expect;
const events = require("../../../client/commands/ping");
const params = require("./__mocks__/ping.mock");

describe("src/client/commands/ping.js", function () {
  describe("Ping 'execute'", function () {
    it("returns true if chat input command is executed successfully", async function () {
      const result = await events.execute(params);
      expect(result).to.be.true;
    });

    it("returns undefined if chat input command is executed unsuccessfully", async function () {
      const result = await events.execute(null);
      expect(result).to.be.undefined;
    });
  });
});
