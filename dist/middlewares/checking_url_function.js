"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = validator;
function checker(url) {
    try {
        new URL(url);
        return true;
    }
    catch (err) {
        return false;
    }
}
function validator(req, res, next) {
    const { url } = req.body;
    if (checker(url)) {
        console.log("ok");
        next();
    }
    else {
        res.status(404).json({
            msg: "URL Is Incorrect"
        });
    }
}
