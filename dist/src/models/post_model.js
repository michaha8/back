"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    sender: {
        type: String,
        required: true
    },
});
module.exports = mongoose_1.default.model('ForgetPasswordRequest', postSchema);
//# sourceMappingURL=post_model.js.map