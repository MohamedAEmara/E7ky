import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });      // relative to app.js (entry point)

let connectionString = process.env.CONNECTION_STRING;
connectionString = connectionString.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB connected successfully 🌎');
    } catch (err) {
        console.log(err);
        process.exit(1);        // Exit the process with failure.
    }

}
