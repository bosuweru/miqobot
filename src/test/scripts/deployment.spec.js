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

  before(function () {
    folder = path.join(__dirname, "../../client/commands");
    script = new deploy(folder);

    spyLoad = spy(script, "load");
    spySave = spy(script, "save");

    script.load();
    script.save();
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
      //
    });
  });
});
