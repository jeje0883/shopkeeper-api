import request from 'supertest'; // Supertest for HTTP testing
import { expect } from 'chai'; // Chai's expect assertion style
import { app, mongoose } from '../index.js'; // Import your app and database connection
import { faker } from '@faker-js/faker';
import User from '../../../Booking/server/models/User.js';

// Generate random user data
const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = `${firstName}${lastName}@mail.com`.toLowerCase();
const password = '12345678';

const user = {firstName,lastName, email, password};
let userToken;

describe('shopkeeper_api-test', function () {
    this.timeout(10000); // Set timeout for test execution

    // Clean up resources after tests
    after(() => {
        mongoose.connection.close(); // Close the database connection
    });

    it('api_users_post_register_successful', async () => {
        // Data to send in the request body

        const response = await request(app)
            .post('/api/v1/users/register') // Use the correct route
            .send(user); // Send the user data in the request body

        const { status, body } = response;

        // Assertions
        expect(status).to.equal(201, 'Response status should be 201');
        expect(body).to.have.property('message').equal('User registered successfully',body.message);
        expect(body).to.have.nested.property('user.firstName', user.firstName);
        expect(body).to.have.nested.property('user.lastName', user.lastName);
        
    });

    it('api_users_post_register_failed_email_invalid_format', async () => {
        const newUser =  {...user};
        newUser.email = 'invalidemailformat';

        // Data to send in the request body
        const response = await request(app)
            .post('/api/v1/users/register') // Use the correct route
            .send(newUser); // Send the user data in the request body

        const { status, body } = response;

        // Assertions
        expect(status).to.equal(400, 'Response status should be 400');
        expect(body).to.have.property('error').equal('Invalid email format', body.error);        
    });

    it('api_users_post_register_failed_email_already_exist', async () => {
        // Data to send in the request body
        const response = await request(app)
            .post('/api/v1/users/register') // Use the correct route
            .send(user); // Send the user data in the request body

        const { status, body } = response;

        // Assertions
        expect(status).to.equal(400, 'Response status should be 400');
        expect(body).to.have.property('error').equal('Email already exists', body.error);        
    });

    it('api_users_post_register_failed_incomplete_fields', async () => {
        const newUser = {...user};
        newUser.email = null;

        // Data to send in the request body
        const response = await request(app)
            .post('/api/v1/users/register') // Use the correct route
            .send(newUser); // Send the user data in the request body

        const { status, body } = response;

        // Assertions
        expect(status).to.equal(400, 'Response status should be 400');
        expect(body).to.have.property('error').equal('All fields are required', body.error);        
    });

    it('api_users_post_login_successful', async () => {
        // Data to send in the request body

        const response = await request(app)
            .post('/api/v1/users/login') // Use the correct route
            .send(user); // Send the user data in the request body

        const { status, body } = response;


        // Assertions
        expect(status).to.equal(200, 'Response status should be 200');
        expect(body).to.have.property('message').equal('Login successful',body.message);
        expect(body).to.have.property('token', body.token);
        
    }); 

    it('api_users_post_login_failed_incomplete_body', async () => {
        // Data to send in the request body
        const response = await request(app)
            .post('/api/v1/users/login') // Use the correct route
            .send({}); // Send the user data in the request body

        const { status, body } = response;
 
        // Assertions
        expect(status).to.equal(400, 'Response status should be 400');
        expect(body).to.have.property('error').equal('Email and password are required',body.error);        
    });

    it('api_users_post_login_failed_invalid_credential', async () => {
        const newUser = {...user};
        newUser.password = 'wrongpassword';
        // Data to send in the request body
        const response = await request(app)
            .post('/api/v1/users/login') // Use the correct route
            .send(newUser); // Send the user data in the request body

        const { status, body } = response;
 
        // Assertions
        expect(status).to.equal(400, 'Response status should be 400');
        expect(body).to.have.property('error').equal('Invalid credentials',body.error);        
    });


});
