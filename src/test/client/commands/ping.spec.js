"use strict";

const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

const { spy } = require("sinon");
const { expect } = require("chai");

const { Command } = require("../../../client/commands/ping");

describe("Ping Command Test Suite", function () {
  let Ping;

  let result;
  let spyExecute;

  before(async function () {
    Ping = new Command();

    spyExecute = spy(Ping, "execute");
    result = await Ping.execute();
  });

  describe("Constructor Method", function () {
    it("...verify command initialization", function () {
      expect(Command).to.be.a("function");
      expect(Ping).to.be.instanceOf(Command);
      expect(Ping.data).to.be.instanceOf(SlashCommandBuilder);
      expect(Ping.data.name).to.be.a("string");
      expect(Ping.data.description).to.be.a("string");
      expect(Ping.cooldown).to.be.a("number");
    });

    it("...validate command initialization", function () {
      expect(Ping.data.name).to.equal("ping");
      // eslint-disable-next-line prettier/prettier
      expect(Ping.data.description).to.equal("Measures RTT and websocket heartbeat.");
      expect(Ping.cooldown).to.equal(3);
    });
  });

  describe("Execute Method", function () {
    it("...verify execution", function () {
      expect(Ping.execute).to.be.a("function");
      expect(spyExecute.called).to.be.true;
    });

    it("...validate execution", function () {
      expect(result).to.be.null;
    });
  });
});
