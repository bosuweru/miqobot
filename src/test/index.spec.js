"use strict";

const expect = require("chai").expect;

require("../scripts/deployment");
const { manager } = require("../index");

describe("src/index.js", function () {
  describe("ShardingManager", function () {
    it("...is of type null for token", function () {
      expect(manager.token).to.be.null;
    });

    it("...is of type string for file", function () {
      expect(manager.file).to.be.a("string");
    });

    it("...is of type string for mode", function () {
      expect(manager.mode).to.be.a("string");
    });

    it("...is of type boolean for respawn", function () {
      expect(manager.respawn).to.be.a("boolean");
    });
  });

  describe("Event[ShardCreate]", function () {
    it("...returns undefined", function () {
      const boolean = manager.emit("shardCreate", { id: 0 });
      expect(boolean).to.be.true;
    });
  });
});
