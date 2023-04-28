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
const runMatchingAlgorithm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("runMatchingAlgorithm");
    try {
        const interns = yield user_model_1.default.find({ userType: 'intern' }, { name: 1, preferenceArray: 1, partnerID: 1, _id: 0 }).lean();
        const hospitals = yield user_model_1.default.find({ userType: 'hospital' }, { name: 1, preferenceArray: 1, hospitalQuantity: 1, _id: 0 }).lean();
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
        internMatches[intern.name] = null;
    }
    for (const hospital of hospitals) {
        hospitalMatches[hospital.name] = [];
    }
    // While there are still unmatched interns
    while (Object.values(internMatches).includes(null)) {
        for (const intern of interns) {
            // Skip matched interns
            if (internMatches[intern.name] != null) {
                continue;
            }
            // Propose to highest ranked unmatched hospital that has not yet rejected them and has available spots
            for (const hospitalName of intern.preferences) {
                const hospital = hospitals.find(h => h.name === hospitalName);
                if (hospitalMatches[hospitalName].length < hospital.numberOfInterns) {
                    hospitalMatches[hospitalName].push(intern.name);
                    internMatches[intern.name] = hospitalName;
                    break;
                }
            }
            // If intern is part of a couple, and their partner is also unmatched, consider partner for the same hospital
            if (intern.partner != null && internMatches[intern.partner] == null) {
                for (const hospitalName of intern.preferences) {
                    const hospital = hospitals.find(h => h.name === hospitalName);
                    if (hospitalMatches[hospitalName].length < hospital.numberOfInterns) {
                        hospitalMatches[hospitalName].push(intern.partner);
                        internMatches[intern.partner] = hospitalName;
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
    user_model_1.default.updateMany({ name: { $in: internNames } }, { $set: { matchingArray: intern => [internMatches[intern.name]] } }).then(() => {
        console.log('Matching arrays of all the interns updated successfully');
    }).catch(err => {
        console.error('Error while updating matching arrays of all the interns:', err);
    });
    // Update the matching systems of all the hospitals
    const hospitalNames = hospitals.map(hospital => hospital.name);
    const updatePromises = [];
    for (const hospitalName of hospitalNames) {
        const internNames = hospitalMatches[hospitalName];
        updatePromises.push(user_model_1.default.updateMany({ name: { $in: internNames } }, { $push: { matchingArray: hospitalName } }));
    }
    Promise.all(updatePromises).then(() => {
        console.log('Matching systems of all the hospitals updated successfully');
    }).catch(err => {
        console.error('Error while updating matching systems of all the hospitals:', err);
    });
}
module.exports = { runMatchingAlgorithm };
//# sourceMappingURL=algorithms.js.map