const express = require('express');
const router = express.Router();

const message_controller = require("../controllers/messageController");
// All the route functions are defined in /routes/catalog.js: 
// The message_list is likely a function defined in your messageController module. 
// Get catalog Home Page
router.get("/", message_controller.message_list);

// In order to implement our form handling code, we will need two routes that have the same URL pattern. 
// The first (GET) route is used to display a new empty form for creating the object. 
// The second route (POST) is used for validating data entered by the user, and then saving the 
// information and redirecting to the detail page (if the data is valid) or redisplaying the form 
// with errors (if the data is invalid).

// Get request for creating a Message
router.get("/message/create", message_controller.message_create_get);

// Post request for creating a Message
router.post("/message/create", message_controller.message_create_post);



module.exports = router;
