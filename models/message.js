const mongoose = require('mongoose');
const { DateTime } = require("luxon");

// Define schema
const Schema = mongoose.Schema;

const messageSchema = new Schema({

    messageUser: { type: String, required: true, maxLength: 100 },
    messageText: { type: String, required: true, maxLength: 100 },
    messageDate: { type: Date, default: Date.now }
});
// virtual for this message  instance URL
messageSchema.virtual("url").get(function () {
    return "/catalog";
})
// // virtual for messageUser & messageText
messageSchema.virtual('userText').get(function () {
    let userMessage = "";
    if (this.messageUser && this.messageText) {
        userMessage = `${this.messageUser}:${this.messageText}`;
    }

    return userMessage;
});
// you're defining a virtual property called "messageDate_formated" for a Mongoose schema  in a Node.js 
// application. This virtual property is using the get method to format the "messageDate" field 
// into a human-readable date string using the Luxon library's DateTime class.
// Inside the getter function, it uses Luxon's DateTime.fromJSDate() to create a Luxon DateTime object 
// from the raw JavaScript Date object stored in the "messageDate" field. Then, it formats this 
// DateTime object using toLocaleString(DateTime.DATE_MED) to obtain a string representation of the 
// date in a medium format. i-e Dec 31, 2023
// messageSchema.virtual("messageDate_formated").get(function(){
//     return DateTime.fromJSDate(this.messageDate).toLocaleString(DateTime.DATE_MED);
// })

// f you want to include the day of the week along with the date in the formatted string, 
// you can use the DateTime.toFormat() method provided by Luxon.
// EEE represents the abbreviated day of the week (e.g., Mon, Tue).
// EEEE represents the full name of the day of the week (e.g., Sunday, Monday).
// LLL represents the abbreviated month (e.g., Jan, Feb).
// LLLL represents the full name of month
// dd represents the day of the month.
// yyyy represents the year.
messageSchema.virtual("messageDate_formatted").get(function () {
    return DateTime.fromJSDate(this.messageDate).toFormat('EEEE, LLL dd, yyyy');
})


// The first argument ("Message") is the singular name of the collection that will be created 
// in the MongoDB database for this model. Mongoose will automatically pluralize the name and 
// use it as the collection name. The second argument (messageSchema) is the schema you defined 
// earlier.The second argument (messageSchema) is the schema you want to use in creating the model.
// Note: Once you've defined your model classes you can use them to create, update, or delete records,
//  and run queries to get all records or particular subsets of records. We'll show you how to do this 
// in the Using models section, and when we create our views.
// Once you've created a schema you can use it to create models. The model represents a collection of 
// documents in the database that you can search, while the model's instances represent individual 
// documents that you can save and retrieve.
// Compile model from schema
module.exports = mongoose.model("Message", messageSchema);
