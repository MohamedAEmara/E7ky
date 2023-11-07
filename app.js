import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./db/connectDB.js";
const app = express();
dotenv.config({ path: "config.env" });

import exphbs from "express-handlebars";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import storyRouter from "./routes/storiesRoutes.js";

import passport from "passport";
import session from "express-session";

import cors from "cors";

app.use(cors({ origin: 'https://e7ky.onrender.com' }));
app.use(express.urlencoded({ extended: true })); // Body parsing middleware

// Method Override to change the verb of the request.
import methodOverride from "method-override";
// app.use(methodOverride('_method'));
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Import helpers
import { formatDate, stripTags, truncate, editIcon, getAuthNameFromStory, getUserImageFromStory, getStoryTitle } from "./helpers/hbs.js";

// Passport Config:
// import passportConfig from "./utils/passportConfig.js";
import { passportConfig } from './utils/passportConfig.js';
passportConfig(passport);
// This is an alternative way of using require()
// require('./config/passport')(passport)


// Static Folders:
import path from 'path';
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(`./public`));


// Sessions: 
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false
}));


// Body Parser:
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Passport middleware:
app.use(passport.initialize());
app.use(passport.session())
const port = process.env.PORT || 3000;
const mode = process.env.NODE_ENV || "production";

// Handlebars   ===>    for template engine..
app.engine('.hbs', exphbs({ helpers: {
  formatDate
}, defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");


app.engine(
    '.hbs',
    exphbs({
      // Use Helpers from "helpers/hbs.js"
      helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        getAuthNameFromStory,
        getUserImageFromStory,
        getStoryTitle
      },
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )
app.set('view engine', '.hbs');

app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/stories', storyRouter);


app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`Server is running in ${mode} mode on port ${port}...`);

    if(mode === "development") {
        app.use(morgan('dev'));
    }
  } catch (err) {
    console.log(err);
  }
}); 