"use strict";

require("../scripts/deployment");
const expect = require("chai").expect;
const manager = require("../index").manage;

describe("src/index.js", function () {
  describe("ShardingManager 'shardCreate'", function () {
    it("returns true if event has listener attached", function () {
      const boolean = manager.emit("shardCreate", { id: 0 });
      expect(boolean).to.be.true;
    });
  });
});
