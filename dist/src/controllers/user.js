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
//Algorithm 1 
const getInternName = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const intern = yield user_model_1.default.findOne({ idIntern: id }, { name: 1, _id: 0 }).lean();
        if (intern) {
            return intern.name;
        }
        else {
            throw new Error(`Intern with id ${id} not found`);
        }
    }
    catch (error) {
        console.error(`Error while getting intern name for id ${id}:`, error);
        throw error;
    }
});
const runMatchingAlgorithm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("runMatchingAlgorithm");
    try {
        const interns = yield user_model_1.default.find({ userType: 'intern' }, { name: 1, preferenceArray: 1, partnerID: 1, _id: 0 }).lean();
        const hospitals = yield user_model_1.default.find({ userType: 'hospital' }, { name: 1, preferenceArray: 1, hospitalQuantity: 1, _id: 0 }).lean();
        console.log(interns);
        console.log(hospitals);
        // Replace partnerID with partner's name for each intern
        for (let i = 0; i < interns.length; i++) {
            const partnerID = interns[i].partnerID;
            if (partnerID != 'None') {
                console.log(partnerID);
                const partnerName = yield getInternName(partnerID);
                interns[i].partnerID = partnerName;
            }
        }
        console.log('After Change Name');
        console.log(interns);
        stablePairing(interns, hospitals);
        return { interns, hospitals };
    }
    catch (err) {
        console.error(err);
    }
});
function stablePairing(interns, hospitals) {
    // Initialize all interns and hospitals as unmatched
    const internMatches = {};
    const hospitalMatches = {};
    for (const intern of interns) {
        console.log(`Intern ${intern.preferenceArray}`);
        internMatches[intern.name] = null;
    }
    for (const hospital of hospitals) {
        hospitalMatches[hospital.name] = [];
    }
    console.log(internMatches);
    console.log(hospitalMatches);
    // While there are still unmatched interns
    while (Object.values(internMatches).includes(null)) {
        for (const intern of interns) {
            // Skip matched interns
            if (internMatches[intern.name] != null) {
                continue;
            }
            // Propose to highest ranked unmatched hospital that has not yet rejected them and has available spots
            for (const hospitalName of intern.preferenceArray) {
                const hospital = hospitals.find(h => h.name === hospitalName);
                if (hospitalMatches[hospitalName].length < hospital.hospitalQuantity) {
                    hospitalMatches[hospitalName].push(intern.name);
                    internMatches[intern.name] = hospitalName;
                    break;
                }
            }
            // If intern is part of a couple, and their partner is also unmatched, consider partner for the same hospital
            if (intern.partnerID != "None" && internMatches[intern.partnerID] == null) {
                for (const hospitalName of intern.preferenceArray) {
                    const hospital = hospitals.find(h => h.name === hospitalName);
                    if (hospitalMatches[hospitalName].length < hospital.hospitalQuantity) {
                        hospitalMatches[hospitalName].push(intern.partnerID);
                        internMatches[intern.partnerID] = hospitalName;
                        break;
                    }
                }
            }
        }
    }
    // Check if a stable pairing was found
    if (!Object.values(internMatches).includes(null)) {
        console.log("A stable pairing was found.");
    }
    else {
        console.log("A stable pairing was not found.");
    }
    // Update the matching arrays of all the interns
    const internNames = interns.map(intern => intern.name);
    const updateInternPromises = [];
    for (const internName of internNames) {
        updateInternPromises.push(user_model_1.default.updateOne({ name: internName }, { $set: { "matchingArray.0": internMatches[internName] } }));
    }
    Promise.all(updateInternPromises).then(() => {
        console.log('Matching arrays of all the interns updated successfully');
    }).catch(err => {
        console.error('Error while updating matching arrays of all the interns:', err);
    });
    // Update the matching systems of all the hospitals
    const hospitalNames = hospitals.map(hospital => hospital.name);
    const updateHospitalPromises = [];
    for (const hospitalName of hospitalNames) {
        const internNames = hospitalMatches[hospitalName];
        updateHospitalPromises.push(user_model_1.default.updateOne({ name: hospitalName }, { $set: { matchingArray: internNames } }));
    }
    Promise.all(updateHospitalPromises).then(() => {
        console.log('Matching systems of all the hospitals updated successfully');
    }).catch(err => {
        console.error('Error while updating matching systems of all the hospitals:', err);
    });
}
//TabuSearch algorithm
const runTabuSearchAlgorithm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("runTabuSearchAlgorithm");
    try {
        const interns = yield user_model_1.default.find({ userType: 'intern' }, { name: 1, preferenceArray: 1, partnerID: 1, _id: 0 }).lean();
        const hospitals = yield user_model_1.default.find({ userType: 'hospital' }, { name: 1, preferenceArray: 1, hospitalQuantity: 1, _id: 0 }).lean();
        console.log(interns);
        console.log(hospitals);
        for (let i = 0; i < interns.length; i++) {
            const partnerID = interns[i].partnerID;
            if (partnerID != 'None') {
                console.log(partnerID);
                const partnerName = yield getInternName(partnerID);
                interns[i].partnerID = partnerName;
            }
        }
        const bestMatching = tabuSearch(interns, hospitals, 100, 10).matching;
        // Update the matchingArray of all the interns
        const internNames = interns.map(intern => intern.name);
        const updateInternPromises = [];
        for (const internName of internNames) {
            updateInternPromises.push(user_model_1.default.updateOne({ name: internName }, { $set: { "matchingArray.1": bestMatching[internName] } }));
        }
        Promise.all(updateInternPromises).then(() => {
            console.log('Matching arrays of all the interns updated successfully');
        }).catch(err => {
            console.error('Error while updating matching arrays of all the interns:', err);
        });
        // Update the matchingArray of all the hospitals
        const hospitalNames = hospitals.map(hospital => hospital.name);
        const updateHospitalPromises = [];
        for (const hospitalName of hospitalNames) {
            const internNames = bestMatching[hospitalName];
            const matchingArrayValue = internNames.length > 0 ? internNames : null;
            updateHospitalPromises.push(user_model_1.default.updateOne({ name: hospitalName }, { $set: { matchingArray: matchingArrayValue } }));
        }
        Promise.all(updateHospitalPromises).then(() => {
            console.log('Matching arrays of all the hospitals updated successfully');
        }).catch(err => {
            console.error('Error while updating matching arrays of all the hospitals:', err);
        });
        return { interns, hospitals };
    }
    catch (err) {
        console.error(err);
    }
});
function compareMoves(move1, move2) {
    return move1.internName && move2.internName && move1.internName === move2.internName &&
        move1.hospitalName && move2.hospitalName && move1.hospitalName === move2.hospitalName;
}
function calculateStability(matching, hospitals) {
    let stability = 0;
    for (const hospitalName in matching) {
        const internName = matching[hospitalName];
        const hospital = hospitals[hospitalName];
        if (!hospital || !internName || !hospital.preferencesArray || !hospital.capacities) {
            // Handle missing or undefined values
            continue;
        }
        const preferredInternName = hospital.preferences[hospital.capacities - 1];
        if (internName === preferredInternName) {
            stability++;
        }
        else {
            const intern = hospital.interns[internName];
            if (intern.preferencesArray.indexOf(preferredInternName) < matching[hospitalName].indexOf(internName)) {
                stability++;
            }
        }
    }
    return stability;
}
function createRandomInput(interns, hospitals) {
    // Initialize a random matching
    const matching = {};
    const freeInterns = [];
    for (const intern of interns) {
        console.log('intern ' + intern);
        freeInterns.push(intern.name);
    }
    for (const hospital of hospitals) {
        matching[hospital.name] = [];
    }
    while (freeInterns.length > 0) {
        const internName = freeInterns.pop();
        const intern = interns.find(i => i.name === internName);
        for (const hospitalName of intern.preferenceArray) {
            const hospital = hospitals.find(h => h.name === hospitalName);
            if (matching[hospitalName].length < hospital.hospitalQuantity) {
                matching[hospitalName].push(internName);
                break;
            }
        }
    }
    console.log(`First Matching `, matching);
    return { interns: interns, hospitals: hospitals, matching: matching };
}
function tabuSearch(interns, hospitals, maxIterations, tabuSize) {
    // Initialize the random matching
    const input = createRandomInput(interns, hospitals);
    const initialMatching = input.matching;
    // Initialize the tabu list and the best solution found so far
    const tabuList = [];
    let bestMatching = initialMatching;
    let bestStability = calculateStability(bestMatching, hospitals);
    // Start the search
    let currentMatching = initialMatching;
    let iteration = 0;
    let i = 1;
    while (iteration < maxIterations) {
        i++;
        // Generate a list of candidate moves
        const candidateMoves = generateCandidateMoves(currentMatching, hospitals);
        // Filter out moves that violate tabu conditions
        const tabuMoves = filterTabuMoves(candidateMoves, tabuList);
        // Choose the best move
        const bestMove = chooseBestMove(tabuMoves, currentMatching, hospitals);
        // Update the current matching
        currentMatching = applyMove(currentMatching, bestMove);
        console.log(`Change number ${i} `, currentMatching);
        // Update the tabu list
        tabuList.unshift(bestMove);
        if (tabuList.length > tabuSize) {
            tabuList.pop();
        }
        // Update the best solution found so far
        const stability = calculateStability(currentMatching, hospitals);
        if (stability > bestStability) {
            bestMatching = currentMatching;
            bestStability = stability;
        }
        // Increment the iteration counter
        iteration++;
    }
    // Return the best solution found
    return { matching: bestMatching, hospitals: hospitals, stability: bestStability };
}
function generateCandidateMoves(currentMatching, hospitals) {
    const moves = [];
    for (const hospital of hospitals) {
        const interns = currentMatching[hospital.name];
        for (let i = 0; i < interns.length; i++) {
            for (let j = i + 1; j < interns.length; j++) {
                const move = { hospitalName: hospital.name, internName1: interns[i], internName2: interns[j] };
                moves.push(move);
            }
        }
    }
    return moves;
}
function filterTabuMoves(candidateMoves, tabuList) {
    const tabuMoves = [];
    for (const move of candidateMoves) {
        if (!tabuList.some(m => compareMoves(m, move))) {
            tabuMoves.push(move);
        }
    }
    return tabuMoves;
}
function applyMove(currentMatching, move) {
    if (!move || !move.hospitalName || !move.internName1 || !move.internName2) {
        return currentMatching;
    }
    const hospital = currentMatching[move.hospitalName];
    const intern1Index = hospital.indexOf(move.internName1);
    const intern2Index = hospital.indexOf(move.internName2);
    const newHospital = [...hospital];
    newHospital[intern1Index] = move.internName2;
    newHospital[intern2Index] = move.internName1;
    const newMatching = Object.assign({}, currentMatching);
    newMatching[move.hospitalName] = newHospital;
    return newMatching;
}
function chooseBestMove(tabuMoves, currentMatching, hospitals) {
    let bestMove = null;
    let bestStability = -1;
    for (const move of tabuMoves) {
        const matchingCopy = applyMove(currentMatching, move);
        const stability = calculateStability(matchingCopy, hospitals);
        if (stability > bestStability) {
            bestMove = move;
            bestStability = stability;
        }
    }
    return bestMove;
}
module.exports = { getUserById, upadteUserIntern, getUserTypeByEmail, getAllInternsUsers, getUserByIdIntern, getAllHospitalsUsers, runMatchingAlgorithm, runTabuSearchAlgorithm };
//# sourceMappingURL=user.js.map