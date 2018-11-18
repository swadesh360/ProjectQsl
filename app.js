const express = require("express"),
  bodyParser = require("body-parser"),
  exphbs = require("express-handlebars"),
  path = require("path"),
  nodemailer = require("nodemailer"),
  cookieParser = require("cookie-parser"),
  expressValidator = require("express-validator"),
  flash = require("connect-flash"),
  session = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  mongo = require("mongodb"),
  mongoose = require("mongoose");

app = express();
routes = require("./routes/index");
users = require("./routes/users");
mongoose.connect(
  "mongodb://swadeshUts:abcd1234567890@ds253353.mlab.com:53353/qsl",
  { useNewUrlParser: true }
);
var db = mongoose.connection;

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
app.set("view engine", "handlebars");

//static folder
app.use("/public", express.static(path.join(__dirname, "public")));
//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.get("/customers", function(req, res) {
  res.sendFile(path.join(__dirname + "/views/customers.html"));
});

app.get("/about", function(req, res) {
  res.sendFile(path.join(__dirname + "/views/about.html"));
});
app.get("/services", function(req, res) {
  res.sendFile(path.join(__dirname + "/views/servicePage.html"));
});

//For Hardware Refabrication Route

app.get("/HardwareRefabrication", function(req, res) {
  res.sendFile(
    path.join(__dirname + "/views/HardwareRefabrication/Hardware.html")
  );
});

//For Network Configuration
app.get("/ProductTestScreen", function(req, res) {
  res.sendFile(
    path.join(__dirname + "/views/ProductTestScreen/ProductTestScreen.html")
  );
});
app.get("/ReverseLogistics", function(req, res) {
  res.sendFile(
    path.join(__dirname + "/views/ReverseLogistics/ReverseLogistics.html")
  );
});
app.get("/DepotRepair", function(req, res) {
  res.sendFile(path.join(__dirname + "/views/DepotRepair/DepotRepair.html"));
});

app.get("/RmaManagement", function(req, res) {
  res.sendFile(
    path.join(__dirname + "/views/RmaManagement/RmaManagement.html")
  );
});

app.get("/customers", function(req, res) {
  res.sendFile("views/customers.html");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.post("/send", (req, res) => {
  var output = ` 
      <p> You have a new contact request </p>
      <h3> Contact Details <h3>
      <ul>
         <li> Name: ${req.body.name} <li>
         <li> Company:${req.body.company} <li>
         <li> Phone: ${req.body.phone} <li>
         <li> Email: ${req.body.email} <li>
       </ul>
       <h3> Messages </h3>
          <p> ${req.body.message} </p>

  `;
  let transporter = nodemailer.createTransport({
    service: "gmail", // or can use service instead
    // port: 587 , // can use port 465 also
    // secure: false , // IF we use port 465 it is secure

    auth: {
      user: "default4835@gmail.com", // Authn for web mail ( ArlifeInsurance@Wealth.com.au)
      pass: "Bachelors@4835" // Pass for AR mail generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // For node mailer
  let mailOptions = {
    from: '"QSL" <default4835@gmail.com>', // sender address
    to: "swadesh360@gmail.com ",
    subject: "Enquiry on Jobs", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { msg: "Email has been send" });
  });
});

//Express Session
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

//Connect Flash
app.use(flash());

//Global Vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use("/users", users);

//Set port
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});
