"use strict";

module.exports = {
  user: { id: "0" },
  client: null,
  commandName: null,
  chatInputCommand: null,
  setClient(client) {
    this.client = client;
  },
  setCommandName(string) {
    this.commandName = string;
  },
  isChatInputCommand() {
    return this.chatInputCommand;
  },
  setChatInputCommand(boolean) {
    this.chatInputCommand = boolean;
  },
};
