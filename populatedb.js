#! /usr/bin/env node

// Run this command to load sample data into miniMessageBoardDatabase
// after run this command see into MongoDB Atlas.
// node populatedb mongodb+srv://test:1234@cluster0.hfb3gt4.mongodb.net/miniMessageBoardDatabase


console.log(
  'This script populates some test messages to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');
const Message = require('./models/message');

const messages = [];

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createMessages();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function messageCreate(index, messageUser, messageText, messageDate) {
  const messageDetail = {
    messageUser: messageUser,
    messageText: messageText,
    messageDate: messageDate,
  };

  const message = new Message(messageDetail);
  await message.save();
  messages[index] = message;
  console.log(`Added message: ${messageUser} - ${messageText}`);
}

async function createMessages() {
  console.log('Adding messages');
  await Promise.all([
    messageCreate(0, 'User1', 'Hello World!', new Date()),
    messageCreate(1, 'User2', 'How are you?', new Date()),
    messageCreate(2, 'User1', 'I am good, thank you!', new Date()),
    messageCreate(3, 'Pakistan', 'Available from Pakistan', new Date()),
    // Add more test messages as needed
  ]);
}
