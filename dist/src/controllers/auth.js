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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
function sendError(res, error) {
    res.status(400).send({
        'error': error
    });
}
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return sendError(res, 'Please provide valid email and password');
    }
    try {
        const user = yield user_model_1.default.findOne({ 'email': email });
        if (user == null)
            return sendError(res, 'incorrect user or password');
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match)
            return sendError(res, 'incorrect user or password');
        const accessToken = yield jsonwebtoken_1.default.sign({ 'id': user._id }, process.env.ACCESS_TOKEN_SECRET, { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION });
        const refreshToken = yield jsonwebtoken_1.default.sign({ 'id': user._id }, process.env.REFRESH_TOKEN_SECRET);
        if (user.refresh_tokens == null)
            user.refresh_tokens = [refreshToken];
        else
            user.refresh_tokens.push(refreshToken);
        yield user.save();
        return res.status(200).send({
            'accessToken': accessToken,
            'refreshToken': refreshToken,
            'id': user._id,
            userType: user.userType,
        });
    }
    catch (err) {
        console.log("error:" + err);
        sendError(res, 'fail checking user');
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    if (authHeader == null)
        return sendError(res, 'authtentication missing');
    const refreshToken = authHeader.split(' ')[1];
    if (refreshToken == null)
        return sendError(res, 'authtentication missing');
    try {
        const user = yield jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userObj = yield user_model_1.default.findById(user["id"]);
        if (userObj == null)
            return sendError(res, 'fail validating token');
        if (!userObj.refresh_tokens.includes(refreshToken)) {
            userObj.refresh_tokens = [];
            yield userObj.save();
            return sendError(res, 'fail validating token');
        }
        let newAccessToken, newRefreshToken;
        if (userObj.userType === 'hospital') {
            newAccessToken = yield jsonwebtoken_1.default.sign({ 'id': user["id"] }, process.env.ACCESS_TOKEN_SECRET, { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION });
            newRefreshToken = yield jsonwebtoken_1.default.sign({ 'id': user["id"] }, process.env.REFRESH_TOKEN_SECRET);
        }
        else if (userObj.userType === 'intern') {
            newAccessToken = yield jsonwebtoken_1.default.sign({
                'id': user["id"],
                'educationalInstitution': userObj.educationalInstitution,
                'typeOfInternship': userObj.typeOfInternship,
                'GPA': userObj.GPA
            }, process.env.ACCESS_TOKEN_SECRET, { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION });
            newRefreshToken = yield jsonwebtoken_1.default.sign({ 'id': user["id"] }, process.env.REFRESH_TOKEN_SECRET);
        }
        else {
            return sendError(res, 'Invalid user type');
        }
        userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)] = newRefreshToken;
        yield userObj.save();
        return res.status(200).send({
            'accessToken': newAccessToken,
            'refreshToken': newRefreshToken
        });
    }
    catch (err) {
        return sendError(res, 'fail validating token');
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    if (authHeader == null)
        return sendError(res, 'authtentication missing');
    const refreshToken = authHeader.split(' ')[1];
    if (refreshToken == null)
        return sendError(res, 'authtentication missing');
    try {
        const user = yield jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userObj = yield user_model_1.default.findById(user["id"]);
        if (userObj == null)
            return sendError(res, 'fail validating token');
        if (!userObj.refresh_tokens.includes(refreshToken)) {
            userObj.refresh_tokens = [];
            yield userObj.save();
            return sendError(res, 'fail validating token');
        }
        userObj.refresh_tokens.splice(userObj.refresh_tokens.indexOf(refreshToken, 1));
        yield userObj.save();
        return res.status(200).send();
    }
    catch (err) {
        return sendError(res, 'fail validating token');
    }
});
const authenticateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) {
        return sendError(res, 'Authentication missing');
    }
    const tokenType = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (token == null) {
        return sendError(res, 'Authentication missing');
    }
    try {
        let user;
        if (tokenType === 'Bearer') {
            user = yield jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        }
        else if (tokenType === 'Refresh') {
            user = yield jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        }
        else {
            return sendError(res, 'Invalid token type');
        }
        req.body.userId = user.id;
        console.log("token user:" + user);
        next();
    }
    catch (err) {
        return sendError(res, 'Failed to validate token');
    }
});
const registerIntern = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Im here Intern");
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const city = req.body.city;
    const GPA = req.body.GPA;
    const id = req.body.idIntern;
    const name = req.body.name;
    const avatarUrl = req.body.avatarUrl;
    const userType = req.body.userType;
    const educationalInstitution = req.body.institution;
    const typeOfInternship = req.body.specialization;
    const description = req.body.description;
    const partnerID = req.body.partnerID;
    console.log(educationalInstitution);
    console.log(typeOfInternship);
    console.log(description);
    console.log(req.body);
    if (email == null || password == null) {
        return sendError(res, 'please provide valid email and password');
    }
    try {
        console.log('Im try');
        console.log(req.body.idIntern);
        const user = yield user_model_1.default.findOne({ 'email': email });
        if (user != null) {
            return sendError(res, 'user already registered, try a different name');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPwd = yield bcrypt_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            'email': email,
            'password': encryptedPwd,
            'GPA': GPA,
            'city': city,
            'phoneNumber': phoneNumber,
            'idIntern': id,
            'name': name,
            'avatarUrl': avatarUrl,
            'userType': userType,
            'educationalInstitution': educationalInstitution,
            'typeOfInternship': typeOfInternship,
            'description': description,
            'partnerID': partnerID
        });
        yield newUser.save();
        console.log('succes Register ' + newUser);
        return res.status(200).send({
            'email': email,
            '_id': newUser._id
        });
    }
    catch (err) {
        console.log(err);
        return sendError(res, 'fail ...');
    }
});
const registerHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Im here");
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const city = req.body.city;
    const name = req.body.name;
    const userType = req.body.userType;
    const description = req.body.description;
    const hospitalQuantity = req.body.hospitalQuantity;
    console.log(description);
    if (email == null || password == null) {
        return sendError(res, 'please provide valid email and password');
    }
    try {
        console.log('Im try');
        const user = yield user_model_1.default.findOne({ 'email': email });
        if (user != null) {
            return sendError(res, 'user already registered, try a different name');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPwd = yield bcrypt_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            'email': email,
            'password': encryptedPwd,
            'city': city,
            'phoneNumber': phoneNumber,
            'name': name,
            'userType': userType,
            'description': description,
            'hospitalQuantity': hospitalQuantity
        });
        yield newUser.save();
        console.log('succes Register ' + newUser);
        return res.status(200).send({
            'email': email,
            '_id': newUser._id
        });
    }
    catch (err) {
        console.log(err);
        return sendError(res, 'fail ...');
    }
});
module.exports = { login, refresh, logout, authenticateMiddleware, registerIntern, registerHospital };
//# sourceMappingURL=auth.js.map