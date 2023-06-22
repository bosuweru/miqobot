"use strict";

const expect = require("chai").expect;
const client = require("../../client/client").client;

describe("src/client/client.js", function () {
  describe("Client 'ready'", function () {
    it("returns true if the event had a listener", function () {
      const boolean = client.emit("ready", {});
      expect(boolean).to.be.true;
    });
  });

  describe("Client 'interactionCreate'", function () {
    it("returns true if the event had a listener", function () {
      const boolean = client.emit("interactionCreate", {});
      expect(boolean).to.be.true;
    });
  });
});
