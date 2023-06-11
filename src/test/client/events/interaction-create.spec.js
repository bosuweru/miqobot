"use strict";

const Events = require("discord.js").Events;

const { spy } = require("sinon");
const { expect } = require("chai");

const { Event } = require("../../../client/events/interaction-create");

describe("InteractionCreate Event Test Suite", function () {
  let InteractionCreate;

  let result;
  let spyExecute;

  before(function () {
    InteractionCreate = new Event();

    spyExecute = spy(InteractionCreate, "execute");
    result = InteractionCreate.execute();
  });

  describe("Constructor Method", function () {
    it("...verify event initialization", function () {
      expect(Event).to.be.a("function");
      expect(InteractionCreate).to.be.instanceOf(Event);
      expect(InteractionCreate.name).to.be.a("string");
      expect(InteractionCreate.once).to.be.a("boolean");
    });

    it("...validate event initialization", function () {
      expect(InteractionCreate.name).to.equal(Events.InteractionCreate);
      expect(InteractionCreate.once).to.be.false;
    });
  });

  describe("Execute Method", function () {
    it("...verify execution", function () {
      expect(InteractionCreate.execute).to.be.a("function");
      expect(spyExecute.called).to.be.true;
    });

    it("...validate execution", function () {
      expect(result).to.be.null;
    });
  });
});
