"use strict";

require("../scripts/deployment");
const expect = require("chai").expect;
const manage = require("../index").manage;

describe("src/index.js", function () {
  describe("ShardingManager 'shardCreate'", function () {
    it("returns true if event had listener", function () {
      const boolean = manage.emit("shardCreate", { id: 0 });
      expect(boolean).to.be.true;
    });
  });
});
