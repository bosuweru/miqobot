"use strict";

const expect = require("chai").expect;
const events = require("../../../client/events/interaction-create");

const { Time } = require("@sapphire/duration");
const { Collection } = require("discord.js");

// eslint-disable-next-line prettier/prettier
const { miqobot } = require("../../../assets/configuration/miqobot.configuration.json");

describe("src/client/events/interaction-create.js", function () {
  let interaction;

  afterEach(function () {
    for (const key in interaction) delete interaction[key];
  });

  beforeEach(function () {
    interaction = {
      user: {
        id: miqobot.client.development.id,
      },
      client: {
        cooldown: new Collection(),
        commands: {
          get(string) {
            return string === interaction.command.data.name
              ? interaction.command
              : false;
          },
        },
      },
      command: {
        data: { name: "workflow" },
        cooldown: 1000 / Time.Second,
        execute(object) {
          return object ? true : false;
        },
        autocomplete(object) {
          return object ? true : false;
        },
      },
      commandName: "workflow",
      autocomplete: null,
      chatInputCommand: null,
      reply(object) {
        return object ? true : false;
      },
      isAutocomplete() {
        return this.autocomplete;
      },
      isChatInputCommand() {
        return this.chatInputCommand;
      },
    };
  });

  describe("InteractionCreate 'execute'", function () {
    it("returns undefined if command not found", async function () {
      interaction.commandName = "NaN";
      interaction.autocomplete = true;
      interaction.chatInputCommand = false;

      let result = await events.execute(interaction);
      expect(result).to.be.undefined;

      interaction.autocomplete = false;
      interaction.chatInputCommand = true;

      result = await events.execute(interaction);
      expect(result).to.be.undefined;
    });

    it("returns true if interaction is autocomplete", async function () {
      interaction.autocomplete = true;
      interaction.chatInputCommand = false;

      const result = await events.execute(interaction);
      expect(result).to.be.true;
    });

    it("returns true if interaction is chat input command", async function () {
      interaction.autocomplete = false;
      interaction.chatInputCommand = true;

      let result = await events.execute(interaction);
      expect(result).to.be.true;

      result = await events.execute(interaction);
      expect(result).to.be.true;
    });

    it("returns undefined if interaction is not autocomplete or chat input command", async function () {
      interaction.autocomplete = false;
      interaction.chatInputCommand = false;

      const result = await events.execute(interaction);
      expect(result).to.be.undefined;
    });
  });
});
