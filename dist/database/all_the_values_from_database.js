"use strict";
// this is also a middleware of the database which provide all the data present in the database 
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
exports.getting_value = getting_value;
const __1 = require("..");
function getting_value(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield __1.client.from('websites').select('*').order('created_at', { ascending: false });
        if (error) {
            res.status(500).json({
                msg: "Error Comes in retriving the data"
            });
        }
        else {
            res.status(200).json({
                msg: "data is collected",
                data: data
            });
        }
    });
}
