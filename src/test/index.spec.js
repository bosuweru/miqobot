"use strict";

const expect = require("chai").expect;

const { Miqobot } = require("../index");
const { SapphireClient } = require("@sapphire/framework");

describe("Miqobot Client", function () {
  let miqobot = null;

  after(function () {
    expect(miqobot).to.not.be.null;
    miqobot = null;
  });

  before(function () {
    expect(miqobot).to.be.null;
    miqobot = new Miqobot();
  });

  describe("constructor()", function () {
    it("...initializes the SapphireClient", function () {
      expect(Miqobot).to.be.a("function");
      expect(miqobot).to.be.an.instanceof(Miqobot);
      expect(miqobot.client).to.be.an.instanceOf(SapphireClient);
    });
  });

  describe("connect()", function () {
    it("...simulates establishing a login", function () {
      expect(miqobot.connect).to.be.a("function");
      miqobot.connect();
    });
  });

  describe("disconnect()", function () {
    it("...simulates disconnecting client", function () {
      expect(miqobot.disconnect).to.be.a("function");
      miqobot.disconnect();
    });
  });
});
