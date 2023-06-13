"use strict";

const path = require("node:path");

const { spy } = require("sinon");
const { expect } = require("chai");

const deploy = require("../../scripts/deployment").Deploy;

describe("Deployment Test Suite", function () {
  let folder;
  let script;

  let spyLoad;
  let spySave;

  let result;

  let pingCommand;

  before(function () {
    folder = path.join(__dirname, "../../client/commands");
    script = new deploy(folder);

    spyLoad = spy(script, "load");
    spySave = spy(script, "save");

    script.load();
    result = script.save();

    pingCommand = script.commands.find((obj) => obj.name === "ping");
  });

  describe("Constructor Method", function () {
    it("...verify deployment initialization", function () {
      expect(deploy).to.be.a("function");
      expect(script).to.be.instanceOf(deploy);
      expect(Array.isArray(script.commands)).to.be.true;
      expect(script.commandsPath).to.be.a("string");
      expect(Array.isArray(script.commandFiles)).to.be.true;
    });

    it("...validate deployment initialization", function () {
      expect(script.commands).to.not.be.empty;
    });
  });

  describe("Load Method", function () {
    it("...verify load functionality", function () {
      expect(script.load).to.be.a("function");
      expect(spyLoad.calledOnce).to.be.true;
    });

    it("...validate load functionality", function () {
      expect(pingCommand).to.not.be.undefined;
    });
  });

  describe("Save Method", function () {
    it("...verify save functionality", function () {
      expect(script.save).to.be.a("function");
      expect(spySave.calledOnce).to.be.true;
    });

    it("...validate save functionality", function () {
      expect(result).to.be.null;
    });
  });
});
