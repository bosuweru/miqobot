"use strict";

const Events = require("discord.js").Events;

const { spy } = require("sinon");
const { expect } = require("chai");

const { Event } = require("../../../client/events/client-ready");

describe("ClientReady Event Test Suite", function () {
  let ClientReady;

  let result;
  let spyExecute;

  before(function () {
    ClientReady = new Event();

    spyExecute = spy(ClientReady, "execute");
    result = ClientReady.execute();
  });

  describe("Constructor Method", function () {
    it("...verify event initialization", function () {
      expect(Event).to.be.a("function");
      expect(ClientReady).to.be.instanceOf(Event);
      expect(ClientReady.name).to.be.a("string");
      expect(ClientReady.once).to.be.a("boolean");
    });

    it("...validate event initialization", function () {
      expect(ClientReady.name).to.equal(Events.ClientReady);
      expect(ClientReady.once).to.be.true;
    });
  });

  describe("Execute Method", function () {
    it("...verify execution", function () {
      expect(ClientReady.execute).to.be.a("function");
      expect(spyExecute.called).to.be.true;
    });

    it("...validate execution", function () {
      expect(result).to.be.null;
    });
  });
});
