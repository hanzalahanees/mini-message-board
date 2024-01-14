// The controller is the code that sits between the models and the views. 
// It determines which view is going to be shown, as well as 
// which information is going to populate that view.

const Message = require('../models/message');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.message_list = asyncHandler(async (req, res, next) => {
  // res.send("NOT IMPLEMENTED: Message list");

  // Fetch the latest messages from the database
  const messages = await Message.find({}, "messageUser messageText messageDate").sort({ added: -1 }).limit(50).exec();
  // Add console logs to your code to inspect the content of the messages array 
  // and see if it contains the expected data
  console.log(messages);

  res.render("index", {
    title: "Mini Messageboard Home",
    message_list: messages
  });
});

// Display Message create form on GET.
exports.message_create_get = asyncHandler(async (req, res, next) => {
  // res.send("NOT IMPLEMENTED: Author create GET");
  res.render("message_form", { title: "Create Message" })
});

// Handle Message create on POST.
// exports.message_create_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Message create POST");
// });

// Handle Message create on POST.
// Here use the Array of Middleware []
exports.message_create_post = [

  // Validate and sanitize the name and message fields.
  body("messageUser")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("User name must be atleast 3 characters")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters"),
  body("messageText")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Message text must be specified"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {

    console.log("Name:", req.body.messageUser);
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const message = new Message({
      messageUser: req.body.messageUser,
      messageText: req.body.messageText,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("message_form", {
        title: "Create Message",
        message: message,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Data will be saved here.
      await message.save();
      // after New message saved. Redirect to message page.
      res.redirect(message.url);
    }
  }),
];