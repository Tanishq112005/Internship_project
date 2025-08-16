"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const checking_url_function_1 = require("./middlewares/checking_url_function");
const scrapping_website_1 = require("./middlewares/scrapping_website");
const database_insert_1 = require("./database/database_insert");
const supabase_js_1 = require("@supabase/supabase-js");
const keys_1 = require("./keys");
const all_the_values_from_database_1 = require("./database/all_the_values_from_database");
const updating_the_value_1 = require("./database/updating_the_value");
const deleting_from_database_1 = require("./database/deleting_from_database");
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
exports.client = (0, supabase_js_1.createClient)(keys_1.url, keys_1.public_key);
console.log("Database is connected");
app.post("/", function (req, res) {
    res.status(200).json({
        "msg": "hello"
    });
});
// main function of this route is to validate the website is there or not , scrapped the website and then insert in the
// database 
app.post("/analyizer", checking_url_function_1.validator, scrapping_website_1.scrapping, database_insert_1.inserting_in_database);
// this route for getting you the data of all the website 
app.get("/website_data", all_the_values_from_database_1.getting_value);
// this route for updating the data 
app.put("/update_data/:id", updating_the_value_1.updating_the_value);
// this route for deleting the data 
app.delete("/delete_data/:id", deleting_from_database_1.deleting_from_database);
app.listen(port, function () {
    console.log(`Server is starting on the port ${port}`);
});
