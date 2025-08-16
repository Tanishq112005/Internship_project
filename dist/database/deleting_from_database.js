"use strict";
// this is also the middleware in which we have to delete the value from the database 
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
exports.deleting_from_database = deleting_from_database;
const __1 = require("..");
function deleting_from_database(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        console.log(id);
        const { data, error } = yield __1.client.from('websites').delete().match({ id });
        if (error) {
            res.status(500).json({
                msg: "Something went wrong in deletion of the data"
            });
        }
        else {
            res.status(200).json({
                msg: "Data is deleted from the database"
            });
        }
    });
}
