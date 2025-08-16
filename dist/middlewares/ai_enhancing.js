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
const genai_1 = require("@google/genai");
require('dotenv').config();
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.google_key,
});
function buildPrompt(description) {
    return `You Have to enhance the given description into more detailed and more readable format the given descrpition is ${description}`;
}
function ai_testing(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { brandName, description } = req.body;
        if (!brandName || !description) {
            return res.status(400).json({ msg: "Missing 'description' or 'brand_name' in request body." });
        }
        console.log("--- Sending to AI (v2 Prompt) ---");
        const prompt = buildPrompt(description);
        try {
            const response = yield ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
            const resultText = ((_a = response.text) === null || _a === void 0 ? void 0 : _a.trim()) || "AI did not provide a valid response.";
            return res.json({ result: resultText });
        }
        catch (err) {
            console.error("GenAI error:", err);
            return res.status(500).json({
                Error: Object.assign({ message: err.message }, (process.env.NODE_ENV === "development" && { stack: err.stack }))
            });
        }
    });
}
exports.default = ai_testing;
