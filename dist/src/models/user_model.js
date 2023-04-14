"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: ObjectId
    },
    id: {
        type: String,
        required: function () {
            return this.userType === "intern";
        },
        maxlength: 8
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        maxlength: 10
    },
    avatarUrl: {
        type: String,
        required: function () {
            return this.userType === "intern";
        },
    },
    city: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["hospital", "intern"],
        required: true,
    },
    hospitalQuantity: {
        type: String,
        required: function () {
            return this.userType === "hospital"; // hospitalName is required only for hospital users
        },
    },
    educationalInstitution: {
        type: String,
        required: function () {
            return this.userType === "intern";
        },
    }, typeOfInternship: {
        type: String,
        required: function () {
            return this.userType === "intern";
        },
    }, GPA: {
        type: String,
        required: function () {
            return this.userType === "intern";
        },
    },
    description: {
        type: String,
        required: false,
        maxlength: 200,
    },
    refresh_tokens: {
        type: [String]
    },
    partnerID: {
        type: String,
        required: function () {
            return this.userType === "intern";
        },
    }
});
module.exports = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user_model.js.map