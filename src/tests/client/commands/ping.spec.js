"use strict";

const expect = require("chai").expect;
const command = require("../../../client/commands/ping");

describe("src/client/commands/ping.js", function () {
  let interaction;

  afterEach(function () {
    for (const key in interaction) delete interaction[key];
  });

  beforeEach(function () {
    interaction = {
      client: { ws: { ping: 0 } },
      createdTimestamp: 0,
      reply(object) {
        return object ? { createdTimestamp: 0 } : null;
      },
      editReply(object) {
        return object ? true : false;
      },
    };
  });

  describe("Ping 'execute'", function () {
    it("returns true if chat input command is executed", async function () {
      const result = await command.execute(interaction);
      expect(result).to.be.true;
    });

    it("returns undefined if chat input command is invalid", async function () {
      interaction.client = undefined;

      const result = await command.execute(interaction);
      expect(result).to.be.undefined;
    });
  });
});
