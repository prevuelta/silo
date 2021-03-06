"use strict";

const path = require("path");
const fs = require("fs");

/* Server */
const express = require("express");
const bodyParser = require("body-parser");
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const flash = require("flash");
const pug = require("pug");
const http = require("http");

/* Silo */
const { settings } = require("../config");
const auth = require("./middleware/auth.js");

/* Routes */
const Routes = require("./routes/index");

const app = express();

const { fileDir } = settings;

app.locals.siteName = settings.siteName;
app.locals.siteDomain = settings.domain;

const cwd = process.cwd();
const { SITE_DIR } = process.env;

app.set("views", path.join(cwd, "client/views"));
app.set("view engine", "pug");

app.use(
  session({
    secret: settings.sessionSecret,
    secure: true,
    domain: settings.domain,
  })
);

app.use(flash());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

auth.init(app);

const assetPath = path.join(cwd, fileDir);
const siteBuildDir = path.join(SITE_DIR, "dist");

// Site
app.use("/", express.static(siteBuildDir));

// Admin
app.use("/admin", express.static(path.join(cwd, "client/public")));
app.use("/admin/assets", express.static(assetPath));
app.use(
  "/admin/assets",
  express.static(`${cwd}/node_modules/react-datepicker/dist`)
);

/* Routes */
app.use("/admin", Routes.root);

app.use("/admin/schema", Routes.schema);
app.use("/admin/asset", Routes.assets);
app.use("/admin/user", Routes.users);
app.use("/admin/action", Routes.actions);
// app.use('/admin/data/token', Routes.token);
app.get("/admin/logout", (req, res) => {
  console.log("Logout");
  req.session = null;
  req.logout();
  res.cookie("jwt", "", { expires: new Date() });
  res.redirect("/admin");
});

app.use("/admin/content/:section?/:node?", Routes.manage);
app.use("/admin/manage/:adminsection", Routes.manage);
app.use("/admin/api", Routes.api);
app.use("/image", Routes.image);
app.use("/admin/hook", Routes.hook);

// app.use("/", (req, res, next) => {
//   res.send("This is where app will go");
// });

/* HTTP */
let server = http.createServer(app).listen(settings.port);
console.log(`Server listening on: ${settings.port}`);
