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
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let internAccessToken = '';
let internRefreshToken = '';
let hospitalAccessToken = '';
const emailUser = 'example@gmail.com';
const passwordUser = '123123123';
//const hospitalRefreshToken=''
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    yield user_model_1.default.remove();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    yield user_model_1.default.remove();
    mongoose_1.default.connection.close();
}));
describe('User registration tests', () => {
    test('Register with valid credentials - Intern', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send({
            email: emailUser + 'Intern',
            password: passwordUser,
            name: 'New User',
            phoneNumber: '123456789',
            avatarUrl: 'http://example.com/avatar.jpg',
            city: 'New York',
            userType: 'intern',
            GPA: '100',
            educationalInstitution: 'example',
            typeOfInternship: 'intership',
            description: 'sdfdsf'
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    }));
    test('Register with valid credentials - Hospital', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send({
            email: emailUser,
            password: passwordUser,
            name: 'New User',
            phoneNumber: '123456789',
            avatarUrl: 'http://example.com/avatar.jpg',
            city: 'New York',
            userType: 'hospital',
            hospitalQuantity: '5',
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    }));
    test('Register with missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send({
            email: emailUser,
            password: passwordUser,
            name: 'New User',
            avatarUrl: 'http://example.com/avatar.jpg',
            city: 'New York',
            userType: 'hospital',
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Please provide valid values');
    }));
    test('Register with invalid user type', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send({
            email: emailUser + 'i',
            password: passwordUser,
            name: 'New User',
            phoneNumber: '123456789',
            avatarUrl: 'http://example.com/avatar.jpg',
            city: 'New York',
            userType: 'invalid',
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Please provide a valid user type');
    }));
    test('Register with an already existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send({
            email: emailUser,
            password: 'newpassword123',
            name: 'New User',
            phoneNumber: '123456789',
            avatarUrl: 'http://example.com/avatar.jpg',
            city: 'New York',
            userType: 'hospital',
            hospitalQuantity: '5',
        });
        expect(response.statusCode).toBe(409);
        expect(response.body.error).toBe('User already exists');
    }));
});
describe('User login tests', () => {
    test('Login with valid credentials- Intern', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({ email: emailUser + 'Intern', password: passwordUser });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.userType).toBeDefined();
        internAccessToken = response.body.accessToken;
        internRefreshToken = response.body.refreshToken;
    }));
    test('Login with valid credentials- Hospital', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({ email: emailUser, password: passwordUser });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.userType).toBeDefined();
        hospitalAccessToken = response.body.accessToken;
    }));
    test('Login with invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({ email: emailUser, password: 'wrongpassword' });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('incorrect user or password');
    }));
    test('Login with missing credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({ email: emailUser });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Please provide valid email and password');
    }));
});
describe("Auth Tests", () => {
    test("Not authorized attempt test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/auth/logout')
            .set('Authorization', 'Bearer invalid_token');
        expect(response.statusCode).toEqual(400);
    }));
    test("Refresh with invalid refresh token test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/auth/refresh')
            .set('Authorization', 'Refresh invalid_token');
        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toEqual("fail validating token");
    }));
    test("Authorized intern access to intern route test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'Bearer ' + internAccessToken);
        expect(response.statusCode).toEqual(200);
    }));
    test("Authorized hospital access to hospital route test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'Bearer ' + hospitalAccessToken);
        expect(response.statusCode).toEqual(200);
    }));
    test("Unauthorized access to intern route test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/intern').set('Authorization', 'Bearer ' + hospitalAccessToken);
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Unauthorized access to hospital route test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/hospital').set('Authorization', 'Bearer ' + internAccessToken);
        expect(response.statusCode).not.toEqual(200);
    }));
    test("test expiered token", () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise(r => setTimeout(r, 6000));
        const response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT ' + internAccessToken);
        expect(response.statusCode).not.toEqual(200);
    }));
    test("test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default).get('/auth/refresh').set('Authorization', 'JWT ' + internRefreshToken);
        expect(response.statusCode).toEqual(200);
        internAccessToken = response.body.accessToken;
        expect(internAccessToken).not.toBeNull();
        internRefreshToken = response.body.refreshToken;
        expect(internRefreshToken).not.toBeNull();
        response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT ' + internAccessToken);
        expect(response.statusCode).toEqual(200);
    }));
    test("Logout test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/auth/logout').set('Authorization', 'Refresh ' + internRefreshToken);
        expect(response.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=auth.test.js.map