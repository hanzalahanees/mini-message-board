const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog");
const wikisRouter = require('./routes/wiki');

const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const app = express();


// Set up rate limiter: maximum of twenty requests per minute
// const RateLimit = require("express-rate-limit");
// Express-rate-limit is a middleware package that can be used to limit repeated requests to APIs
// and endpoints. There are many reasons why excessive requests might be made to your site, such as 
// denial of service attacks, brute force attacks, or even just a client or script that is not 
// behaving as expected. Aside from performance issues that can arise from too many requests causing 
// your server to slow down, you may also be charged for the additional traffic. This package can be 
// used to limit the number of requests that can be made to a particular route or set of routes. 
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
// Helmet is a middleware package. It can set appropriate HTTP headers that help protect your app from 
// well-known web vulnerabilities
// We normally might have just inserted app.use(helmet()); to add the subset of the security-related 
// headers that make sense for most sites. However in the LocalLibrary base template we include some 
// bootstrap and jQuery scripts. These violate the helmet's default Content Security Policy (CSP), 
// which does not allow loading of cross-site scripts. To allow these scripts to be loaded we modify 
// the helmet configuration so that it sets CSP directives to allow script loading from the indicated domains.
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);
// Web servers can often compress the HTTP response sent back to a client, significantly reducing the time 
// required for the client to get and load the page. The compression method used will depend on the 
// decompression methods the client says it supports in the request (the response will be sent uncompressed 
// if no compression methods are supported).Add the compression library to the middleware chain with the 
// use() method (this should appear before any routes you want compressed — in this case, all of them!)
app.use(compression()); // Compress all routes

mongoose.set("strictQuery", false);

// const mongoDB = "mongodb+srv://test:1234@cluster0.hfb3gt4.mongodb.net/miniMessageBoardDatabase?retryWrites=true&w=majority";
const dev_db_url =
  "mongodb+srv://test:1234@cluster0.hfb3gt4.mongodb.net/miniMessageBoardDatabase?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;



main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);

  // If the connection is successful, you should see a message logged to the console
  console.log("MongoDB Atlas connected successfully!")
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); // Add catalog routes to middleware chain.
app.use("/wiki", wikisRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
