import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'
 let internAccessToken=''
 let internRefreshToken=''
 let hospitalAccessToken =''
 const emailUser='example@gmail.com'
 const passwordUser='123123123'
 //const hospitalRefreshToken=''

beforeAll(async ()=>{
    await Post.remove()
    await User.remove()
})

afterAll(async ()=>{
    await Post.remove()
    await User.remove()
    mongoose.connection.close()
})

describe('User registration tests', () => {
    test('Register with valid credentials - Intern', async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({
            email: emailUser + 'Intern',
            password: passwordUser,
            name: 'New User',
            phoneNumber: '123456789',
            avatarUrl: 'http://example.com/avatar.jpg',
            city: 'New York',
            userType: 'intern',
            GPA:'100',
            educationalInstitution:'example',
            typeOfInternship:'intership',
            description:'sdfdsf'

          });
    
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
      });
    test('Register with valid credentials - Hospital', async () => {
      const response = await request(app)
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
    });
  
    test('Register with missing required fields', async () => {
      const response = await request(app)
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
    });
  
    test('Register with invalid user type', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: emailUser+'i',
          password: passwordUser,
          name: 'New User',
          phoneNumber: '123456789',
          avatarUrl: 'http://example.com/avatar.jpg',
          city: 'New York',
          userType: 'invalid',
        });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Please provide a valid user type');
    });
  
    test('Register with an already existing email', async () => {
      const response = await request(app)
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
    });
  });

describe('User login tests', () => {
    test('Login with valid credentials- Intern', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({ email: emailUser+'Intern', password: passwordUser });
    
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.userType).toBeDefined();
        internAccessToken=response.body.accessToken
        internRefreshToken=response.body.refreshToken
      });
    test('Login with valid credentials- Hospital', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: emailUser, password: passwordUser });
  
      expect(response.statusCode).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.userType).toBeDefined();
      hospitalAccessToken=response.body.accessToken
    });
  
    test('Login with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: emailUser, password: 'wrongpassword' });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('incorrect user or password');
    });
  
    test('Login with missing credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: emailUser });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Please provide valid email and password');
    });
  });
  


describe("Auth Tests", ()=>{
    test("Not authorized attempt test", async () => {
        const response = await request(app)
          .get('/auth/logout')
          .set('Authorization', 'Bearer invalid_token');
        expect(response.statusCode).toEqual(400);
      });
   
    test("Refresh with invalid refresh token test", async () => {
        const response = await request(app)
            .get('/auth/refresh')
            .set('Authorization', 'Refresh invalid_token');
    
        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toEqual("fail validating token");
    });
    

    test("Authorized intern access to intern route test", async ()=>{
        const response = await request(app).get('/post').set('Authorization', 'Bearer ' + internAccessToken);
        expect(response.statusCode).toEqual(200);
      });
      
      test("Authorized hospital access to hospital route test", async ()=>{
        const response = await request(app).get('/post').set('Authorization', 'Bearer ' + hospitalAccessToken);
        expect(response.statusCode).toEqual(200);
      });
      
      test("Unauthorized access to intern route test", async ()=>{
        const response = await request(app).get('/intern').set('Authorization', 'Bearer ' + hospitalAccessToken);
        expect(response.statusCode).not.toEqual(200);
      });
      
      test("Unauthorized access to hospital route test", async ()=>{
        const response = await request(app).get('/hospital').set('Authorization', 'Bearer ' + internAccessToken);
        expect(response.statusCode).not.toEqual(200);
      });
      
      test("test expiered token",async ()=>{
        await new Promise(r => setTimeout(r,6000))
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + internAccessToken);
        expect(response.statusCode).not.toEqual(200)
    })

      
      test("test refresh token",async ()=>{
        let response = await request(app).get('/auth/refresh').set('Authorization', 'JWT ' + internRefreshToken);
        expect(response.statusCode).toEqual(200)

        internAccessToken = response.body.accessToken
        expect(internAccessToken).not.toBeNull()
        internRefreshToken = response.body.refreshToken
        expect(internRefreshToken).not.toBeNull()
        
        response = await request(app).get('/post').set('Authorization', 'JWT ' + internAccessToken);
        expect(response.statusCode).toEqual(200)

    })
      
      test("Logout test", async ()=>{
        const response = await request(app).get('/auth/logout').set('Authorization', 'Refresh ' + internRefreshToken);
        expect(response.statusCode).toEqual(200);
      });
    });
