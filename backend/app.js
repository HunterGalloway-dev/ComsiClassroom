const exspress = require('express'); // Framework that we use for Node JS - easier
const bodyParser = require('body-parser'); // Makes passing through API requests easier
const request = require('request'); // API that helps us call other APIs in a more effcient and easier way
const mongoose = require('mongoose');
const Lab = require('./models/lab');

const labRoutes = require('./routes/labs');
const userRoutes = require('./routes/user')
const classRoutes = require('./routes/classroom');

const app = exspress(); // Creates our Exspress App

// Sets up our exspress app to automatically parse data into a json file
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

/*
  This middleware gives the response variable access to bypass built in
  security and allow clients to GET POST PATCH DELETE and OPTIONS

  Next is used go deeper into the api and such as a post or get method
*/
app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT,DELETE, OPTIONS"
  );
  next();
});
mongoose.connect("INSERT_MONGO_DB_LINK").
  then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Connected Failed");
  });



app.use('/api/labs',labRoutes);
app.use('/api/user',userRoutes);
app.use('/api/classroom',classRoutes);



/*
  POST -> Data sent declaration

  This endpoint is called when the server is sent data through a POST command
  The sent data is sent through the 'req' value (request)

  Data is thenn sent back to the roginal cleint through the res value as a json
  object, thiss is done through the json method

  We do not want to continue this middleware through the next method as the
  client is being sent data
*/
app.post("/api/run",(req,res,next) => {
  runCode(req.body.lang,req.body.program,(response) => {
    res.status(201).json( {
      code: response
    }); // Everthing was okay -- the 1  means resource was created
  });

});

/*
  This is a method designed to connect to our JDoodle API
  login and run our code, and have it send the response back
  to our front end.
*/
function runCode(lang, code, callback) {
  var program = {
    script: code,
    language: lang,
    versionIndex: '1',
    clientId: '24ee29d4f8ce18804d5f69bdfc253e47',
    clientSecret: '63b671df495998eb6e3385978058ac2f1aaf562db6764c7858d8593d9c8ff205'
  }
  output = '';

  request({
    url: 'https://api.jdoodle.com/v1/execute',
    method: 'POST',
    json: program,
  }, (error, response, body) => {
    /*
      The body variable is what is sent back from JDoodle aka our compiled coee
      while the callback function sychronizes our code, otherwise the method would
      execute and not do anything
    */
    callback(body.output);
  });
}
// Exports our app to allow our server.js file import this exspress app
module.exports = app;
