"use strict";

const sinon = require("sinon");
const expect = require("chai").expect;

const { ChatInputCommandDenied } = require("../../listeners/chat-input");
const { ListenerStore } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

describe("ChatInputCommandDenied Listener", function () {
  let stub = null;
  let event = null;

  after(function () {
    expect(stub).to.not.be.null;
    expect(event).to.not.be.null;
    stub = null;
    event = null;
  });

  before(function () {
    expect(stub).to.be.null;
    expect(event).to.be.null;
    stub = sinon.spy(function () {
      return sinon.createStubInstance(ListenerStore);
    });
    event = new ChatInputCommandDenied(stub);
  });

  describe("builder()", function () {
    it("...executes object builder method", function () {
      expect(event.builder).to.be.a("function");

      event.builder({
        context: { remaining: 500 },
        identifier: "preconditionCooldown",
      });

      event.builder({
        context: { remaining: 1000 },
        identifier: "preconditionCooldown",
      });

      event.builder({
        context: { remaining: 2000 },
        identifier: "preconditionCooldown",
      });
    });
  });

  describe("message()", function () {
    it("...executes object message method", function () {
      expect(event.message).to.be.a("function");

      const embed = event.message({
        color: null,
        title: null,
        description: null,
      });

      expect(embed).to.be.an.instanceOf(EmbedBuilder);
    });
  });

  describe("run()", function () {
    it("...simulates running the listener", async function () {
      expect(event.run).to.be.a("function");
      await event.run(null, { interaction: null });
    });
  });
});
