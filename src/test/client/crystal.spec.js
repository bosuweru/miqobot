"use strict";

const Client = require("discord.js").Client;
const Events = require("discord.js").Events;
const Collection = require("discord.js").Collection;
const IntentsBitField = require("discord.js").IntentsBitField;
const GatewayIntentBits = require("discord.js").GatewayIntentBits;
const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

const { spy } = require("sinon");
const { expect } = require("chai");

const { Crystal } = require("../../client/crystal");

describe("Client Test Suite", function () {
  let Miqobot;

  let bits;
  let client;
  let intents;
  let bitfield;

  let events;
  let commands;
  let cooldowns;
  let collection;

  let clientReady;
  let interactionCreate;

  let ping;

  let spyConnect;
  let spyDisconnect;
  let spySetupEvent;
  let spySetupCommand;
  let spySetupCollection;

  let connection;
  let disconnection;

  before(function () {
    Miqobot = new Crystal();

    bits = [];
    client = Miqobot.client;
    intents = Miqobot.client.options.intents;
    bitfield = Miqobot.client.options.intents.bitfield;
    collection = Miqobot.collection;

    bits.push(GatewayIntentBits.Guilds);

    spySetupCollection = spy(Miqobot, "setupCollection");
    Miqobot.setupCollection();
    events = Miqobot.client.events;
    commands = Miqobot.client.commands;
    cooldowns = Miqobot.client.cooldowns;

    spySetupEvent = spy(Miqobot, "setupEvent");
    Miqobot.setupEvent();
    clientReady = events.get(Events.ClientReady);
    interactionCreate = events.get(Events.InteractionCreate);

    spySetupCommand = spy(Miqobot, "setupCommand");
    Miqobot.setupCommand();
    ping = commands.get("ping");

    spyConnect = spy(Miqobot, "connect");
    spyDisconnect = spy(Miqobot, "disconnect");

    connection = Miqobot.connect();
    disconnection = Miqobot.disconnect();
  });

  describe("Constructor Method", function () {
    it("...verify client initialization", function () {
      expect(Crystal).to.be.a("function");
      expect(Miqobot).to.be.instanceOf(Crystal);
    });

    it("...validate client initialization", function () {
      expect(client).to.be.instanceOf(Client);
      expect(intents).to.be.instanceOf(IntentsBitField);
      expect(bitfield).to.equal(bits.reduce((x, y) => x + y, 0));
    });
  });

  describe("SetupCollection Method", function () {
    it("...verify collection initialization", function () {
      expect(Array.isArray(collection)).to.be.true;
      expect(Miqobot.setupCollection).to.be.a("function");
      expect(spySetupCollection.calledOnce).to.be.true;
    });

    it("...validate collection initialization", function () {
      expect(events).to.be.instanceOf(Collection);
      expect(commands).to.be.instanceOf(Collection);
      expect(cooldowns).to.be.instanceOf(Collection);
      expect(collection).to.not.be.empty;
    });
  });

  describe("SetupEvent Method", function () {
    it("...verify event initialization", function () {
      expect(Miqobot.setupEvent).to.be.a("function");
      expect(spySetupEvent.calledOnce).to.be.true;
    });

    it("...validate event initialization", function () {
      expect(clientReady).to.be.instanceOf(Object);
      expect(clientReady.name).to.equal(Events.ClientReady);
      expect(clientReady.once).to.be.true;
      expect(clientReady.execute).to.be.a("function");

      expect(interactionCreate).to.be.instanceOf(Object);
      expect(interactionCreate.name).to.equal(Events.InteractionCreate);
      expect(interactionCreate.once).to.be.false;
      expect(interactionCreate.execute).to.be.a("function");
    });
  });

  describe("SetupCommand Method", function () {
    it("...verify command initialization", function () {
      expect(Miqobot.setupCommand).to.be.a("function");
      expect(spySetupCommand.calledOnce).to.be.true;
    });

    it("...validate command initialization", function () {
      expect(ping).to.be.instanceOf(Object);
      expect(ping.data).to.be.instanceOf(SlashCommandBuilder);
      expect(ping.data.name).to.equal("ping");
      // eslint-disable-next-line prettier/prettier
      expect(ping.data.description).to.equal("Measures RTT and websocket heartbeat.");
      expect(ping.cooldown).to.equal(3);
      expect(ping.execute).to.be.a("function");
    });
  });

  describe("Connect Method", function () {
    it("...verify connection functionality", function () {
      expect(Miqobot.disconnect).to.be.a("function");
      expect(spyConnect.calledOnce).to.be.true;
    });

    it("...validate connection functionality", function () {
      expect(connection).to.be.null;
    });
  });

  describe("Disconnect Method", function () {
    it("...verify disconnection functionality", function () {
      expect(Miqobot.connect).to.be.a("function");
      expect(spyDisconnect.calledOnce).to.be.true;
    });

    it("...validate disconnection functionality", function () {
      expect(disconnection).to.be.null;
    });
  });
});
