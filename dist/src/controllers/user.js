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
function sendError(res, error) {
    res.status(400).send({
        'error': error
    });
}
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('in here GetUserByID');
    console.log('in here GetUserByID');
    console.log('in here GetUserByID');
    console.log('in here GetUserByID');
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        console.log(user);
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send({ 'error': 'Failed to get user from DB' });
    }
});
const getAllInternsUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getAllInternsUsers");
    try {
        const users = yield user_model_1.default.find({ userType: 'intern' });
        console.log('users-GetAllUsers');
        console.log(users);
        res.status(200).send(users);
    }
    catch (err) {
        res.status(400).send({ 'error': 'Failed to get users from DB' });
    }
});
const getAllHospitalsUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getAllHospitalsUsers");
    try {
        const users = yield user_model_1.default.find({ userType: 'hospital' });
        console.log('users-GetAllUsers');
        console.log(users);
        res.status(200).send(users);
    }
    catch (err) {
        res.status(400).send({ 'error': 'Failed to get users from DB' });
    }
});
const getUserTypeByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.email);
    console.log('Email ' + req.params.email);
    console.log('in here GetTypeByEmail' + req.params.email);
    try {
        const user = yield user_model_1.default.findOne({ 'email': req.params.email });
        console.log(user);
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send({ 'error': 'Failed to get user from DB' });
    }
});
const getUserByIdIntern = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.idIntern);
    console.log('Id Intern ' + req.params.idIntern);
    console.log('in here GetUSerByIdIntern' + req.params.idIntern);
    try {
        const user = yield user_model_1.default.findOne({ 'idIntern': req.params.idIntern });
        console.log(user);
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send({ 'error': 'Failed to get user from DB' });
    }
});
const upadteUserIntern = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('id' + req.body.id);
    console.log(req.body.name);
    console.log("UpdateUser");
    console.log(req.body.userType);
    console.log(req.body);
    if (req.body.userType === 'intern') {
        console.log("UpdateUser Intern");
        const name = req.body.name;
        const avatarUrl = req.body.avatarUrl;
        const id = req.body.id;
        console.log(id);
        const email = req.body.email;
        const city = req.body.city;
        const educationalInstitution = req.body.educationalInstitution;
        const typeOfInternship = req.body.typeOfInternship;
        const GPA = req.body.GPA;
        const description = req.body.description;
        const partnerID = req.body.partnerID;
        const phoneNumber = req.body.phoneNumber;
        const idIntern = req.body.idIntern;
        const preferenceArray = req.body.preferenceArray;
        try {
            const user = yield user_model_1.default.findByIdAndUpdate(id, {
                $set: {
                    name,
                    idIntern,
                    avatarUrl,
                    email,
                    city,
                    educationalInstitution,
                    typeOfInternship,
                    GPA,
                    description,
                    partnerID,
                    phoneNumber,
                    preferenceArray
                }
            });
            yield user.save();
            res.status(200).send({ msg: "Update succes", status: 200 });
        }
        catch (err) {
            res.status(400).send({ err: err.message });
        }
    }
    else {
        console.log("UpdateUserHospital");
        const name = req.body.name;
        const id = req.body.id;
        const email = req.body.email;
        const city = req.body.city;
        const description = req.body.description;
        const phoneNumber = req.body.phoneNumber;
        const preferenceArray = req.body.preferenceArray;
        const hospitalQuantity = req.body.hospitalQuantity;
        console.log(req.body);
        try {
            const user = yield user_model_1.default.findByIdAndUpdate(id, {
                $set: {
                    name,
                    email,
                    city,
                    description,
                    phoneNumber,
                    hospitalQuantity,
                    preferenceArray
                }
            });
            yield user.save();
            res.status(200).send({ msg: "Update succes", status: 200 });
        }
        catch (err) {
            res.status(400).send({ err: err.message });
        }
    }
});
module.exports = { getUserById, upadteUserIntern, getUserTypeByEmail, getAllInternsUsers, getUserByIdIntern, getAllHospitalsUsers };
//# sourceMappingURL=user.js.map