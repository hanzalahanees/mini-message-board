const express = require('express');
const router = express.Router();

// const messages = [
//   {
//     text: "Hi there!",
//     user: "Amando",
//     added: new Date()
//   },
//   {
//     text: "Hello World!",
//     user: "Charles",
//     added: new Date()
//   },
//   {
//     text: "Programming is fun",
//     user: "Hanzalah Anees Khokhar",
//     added: new Date()
//   }
// ];

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Mini Messageboard', messages: messages });
// });

router.get("/", function (req, res) {
  res.redirect("/catalog");

});
// /* GET new message form. */
// router.get('/new', function(req, res, next) {
//   res.render('form', { title: 'New Message' });
// });

// /* POST new message. */
// router.post('/new', function(req, res, next) {
//   const { messageText, messageUser } = req.body;
//   messages.push({ text: messageText, user: messageUser, added: new Date() });
//   res.redirect('/');
// });

module.exports = router;
