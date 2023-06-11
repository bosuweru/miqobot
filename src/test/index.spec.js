"use strict";

const path = require("node:path");

const Collection = require("discord.js").Collection;

const { spy } = require("sinon");
const { expect } = require("chai");

const { Crystals } = require("../index");

describe("Sharding Test Suite", function () {
  let Client;
  let Shards;

  let spySpawn;
  let spySetupListener;

  let file;
  let mode;
  let token;
  let shards;
  let respawn;
  let execArgv;
  let shardArgs;
  let shardList;
  let totalShards;

  before(function () {
    Client = path.join(__dirname, "../client/crystal.js");

    Shards = new Crystals(Client);

    spySetupListener = spy(Shards, "setupListener");
    spySpawn = spy(Shards, "spawn");

    Shards.setupListener();
    Shards.spawn();

    file = Shards.manager.file;
    mode = Shards.manager.mode;
    token = Shards.manager.token;
    shards = Shards.manager.shards;
    respawn = Shards.manager.respawn;
    execArgv = Shards.manager.execArgv;
    shardArgs = Shards.manager.shardArgs;
    shardList = Shards.manager.shardList;
    totalShards = Shards.manager.totalShards;
  });

  describe("Construtor Mehtod", function () {
    it("...verify shard manager initialization", function () {
      expect(file).to.be.a("string");
      expect(mode).to.be.a("string");
      expect(token).to.not.be.a("string");
      expect(shards).to.be.instanceOf(Collection);
      expect(respawn).to.be.a("boolean");
      expect(Array.isArray(execArgv)).to.be.true;
      expect(Array.isArray(shardArgs)).to.be.true;
      expect(shardList).to.be.a("string");
      expect(totalShards).to.be.a("string");
    });

    it("...validate shard manager initialization", function () {
      expect(file).to.equal(Client);
      expect(mode).to.equal("process");
      expect(token).to.be.null;
      expect(shards).to.be.empty;
      expect(respawn).to.be.true;
      expect(execArgv).to.deep.equal(["--trace-warnings"]);
      expect(shardArgs).to.deep.equal(["--ansi", "--color"]);
      expect(shardList).to.equal("auto");
      expect(totalShards).to.equal("auto");
    });
  });

  describe("SetupListener Method", function () {
    it("...verify listener initialization", function () {
      expect(spySetupListener.calledOnce).to.be.true;
    });
  });

  describe("Spawn Method", function () {
    it("...verify spawn execution", function () {
      expect(spySpawn.calledOnce).to.be.true;
    });
  });
});
