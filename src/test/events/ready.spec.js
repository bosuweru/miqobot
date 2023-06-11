"use strict";

const sinon = require("sinon");
const expect = require("chai").expect;

const { Ready } = require("../../listeners/ready");
const { ListenerStore } = require("@sapphire/framework");

describe("Ready Listener", function () {
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
    event = new Ready(stub);
  });

  describe("run()", function () {
    it("...simulates running the listener", async function () {
      expect(event.run).to.be.a("function");
      await event.run(null);
    });
  });
});
