import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./db/connectDB.js";
const app = express();
dotenv.config({ path: "config.env" });

import exphbs from "express-handlebars";
import router from "./routes/index.js";
import { dirname } from "path";

app.use('/', router);


// Static Folders:
import path from 'path';
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(`${dirname}/public`));



const port = process.env.PORT || 3000;
const mode = process.env.NODE_ENV || "production";

// Handlebars   ===>    for template engine..
// app.engine('.hbs', exphbs({ defaultLayout: "main", extname: ".hbs" }));
// app.set("view engine", ".hbs");
import {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
} from './helpers/hbs.js';

app.engine(
    '.hbs',
    exphbs({
      helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
      },
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )
app.set('view engine', '.hbs');

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running in ${mode} mode on port ${port}...`);

    if(mode === "development") {
        app.use(morgan('dev'));
    }
}); 