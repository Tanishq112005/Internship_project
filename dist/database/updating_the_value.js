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
exports.updating_the_value = updating_the_value;
const __1 = require("..");
function updating_the_value(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { brand_name, description, url } = req.body;
        const updates = {};
        if (brand_name !== undefined) {
            updates.brand_name = brand_name;
        }
        if (description !== undefined) {
            updates.description = description;
        }
        if (url !== undefined) {
            updates.url = url;
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'At least one field (url, brand_name, description) must be provided to update.' });
        }
        try {
            const { data, error } = yield __1.client
                .from('websites')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) {
                if (error.code === '23505') {
                    return res.status(409).json({ msg: 'The provided URL already exists.' });
                }
                throw error;
            }
            if (!data) {
                return res.status(404).json({ msg: 'Record not found.' });
            }
            res.status(200).json({
                msg: "Your Data is updated",
                data: data
            });
        }
        catch (error) {
            res.status(500).json({ error: 'An internal server error occurred.' });
        }
    });
}
