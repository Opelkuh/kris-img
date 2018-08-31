//Check env variables
if (!process.env.PORT) {
    console.error("No port specified! Use 'npm start' or add PORT enviromental variable!");
    process.exit(1);
}
if (!process.env.REDIRECT_PATH) {
    console.error("No redirect path specified! Use 'npm start' or add REDIRECT_PATH enviromental variable!");
    process.exit(1);
}
if (!process.env.HASH_SECRET) {
    process.env.HASH_SECRET = "shhh";
    console.error(`No hash secret specified! Default '${process.env.HASH_SECRET}' will be used. Add REDIRECT_PATH enviromental variable ASAP!`);
}
//Libs
const express = require("express");
//Routes
const uiRoute = require("./routes/ui");
const viewRoute = require("./routes/view");
const uploadRoute = require("./routes/upload");
//Express app setup
const app = express();
app.set('view engine', 'pug');

//Add routes
app.use("/", uiRoute);
app.use("/", viewRoute);
app.use("/api/v1", uploadRoute);
//Listen
app.listen(process.env.PORT, (port) => console.log('kris-img listening on port', process.env.PORT));