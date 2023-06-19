"use strict";

const expect = require("chai").expect;

const { manager } = require("../index");

describe("index.js", function () {
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

  describe("ShardingManager Events", function () {
    it("...emits 'shardCreate'", function () {
      const boolean = manager.emit("shardCreate", { id: 0 });
      expect(boolean).to.be.true;
    });
  });
});
