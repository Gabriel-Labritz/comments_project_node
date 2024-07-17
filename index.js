const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const connection = require("./db/connection");

// routes
const authRoutes = require("./routes/authRoutes");
const commentsRoutes = require("./routes/commentsRoutes");

// models
const Comments = require("./models/Comments");

// Controllers
const CommentsController = require("./controllers/commentsController");

// Initilize express
const app = express();
const port = 3000;

// Config express req.body, json and static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Config tamplate engine handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// flash message config
app.use(flash());

// session middleware config
app.use(
  session({
    name: "session",
    secret: "my_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

// set session to res
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

// use routes
app.use("/", authRoutes);
app.use("/comments", commentsRoutes);

// show all comments in the /
app.get("/", CommentsController.showComments);

connection
  .sync()
  .then(() => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
