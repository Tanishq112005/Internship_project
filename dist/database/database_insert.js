"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inserting_in_database = inserting_in_database;
const __1 = require("..");
// this is the middleware but doing the database operation to insert the data 
function inserting_in_database(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { url, brandName, description } = req.body;
        console.log("ok");
        console.log(url);
        console.log(brandName);
        console.log(description);
        const { data, error } = yield __1.client.from('websites')
            .insert([
            {
                url: url,
                brand_name: brandName,
                description: description
            }
        ])
            .select()
            .single();
        if (error) {
            // if this url is already checked 
            if (error.code === '23505') {
                return res.status(409).json({ msg: 'This URL has already been analyzed.' });
            }
            else {
                console.log(error);
                return res.status(500).json({
                    msg: "Some another error"
                });
            }
        }
        res.status(201).json({
            msg: "New Item is created in the database"
        });
    });
}
