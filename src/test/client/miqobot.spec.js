"use strict";

const Events = require("discord.js").Events;

const expect = require("chai").expect;

const { client } = require("../../client/miqobot");

describe("src/client/miqobot.js", function () {
  describe("src/client/events/client-ready.js", function () {
    describe(`Event[Ready]`, function () {
      it(`...returns undefined`, function () {
        const boolean = client.emit(Events.ClientReady, client);
        expect(boolean).to.be.true;
      });
    });
  });

  describe("src/client/events/interaction-create.js", function () {
    let chatInputCommand;

    before(function () {
      chatInputCommand = require("../__mocks__/interaction.mock");
      chatInputCommand.setClient(client);
    });

    beforeEach(function () {
      chatInputCommand.setCommandName("ping");
      chatInputCommand.setChatInputCommand(true);
    });

    describe("Event[InteractionCreate]", function () {
      it("...returns if matching command is found", function () {
        client.emit(Events.InteractionCreate, chatInputCommand);
      });

      it("...returns if no matching command is found", function () {
        chatInputCommand.setCommandName(undefined);
        client.emit(Events.InteractionCreate, chatInputCommand);
      });

      it("...returns if matching command is on cooldown", function () {
        client.emit(Events.InteractionCreate, chatInputCommand);
      });

      it("...returns if interaction is not a command interaction", function () {
        chatInputCommand.setChatInputCommand(false);
        client.emit(Events.InteractionCreate, chatInputCommand);
      });
    });
  });
});
