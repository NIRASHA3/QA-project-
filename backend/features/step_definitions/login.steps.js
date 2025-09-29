const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let response;

When('I submit a short password {string}', async function (password) {
  await submitCredentials('testuser', password);
});

When('I submit an empty password {string}', async function (password) {
  await submitCredentials('testuser', password);
});

When('I submit an empty user ID {string}', async function (userId) {
  await submitCredentials(userId, 'anypassword');
});

When('I submit missing credentials', async function () {
  await submitCredentials(undefined, undefined);
});

When('I submit a valid password {string}', async function (password) {
  await submitCredentials('testuser', password);
});

Then('I should receive a {int} validation error', function (statusCode) {
  expect(response.status).to.equal(statusCode);
});

Then('the error message should indicate {string}', function (expectedMessage) {
  expect(response.data.message).to.include(expectedMessage);
});

Then('I should not receive a validation error', function () {
  // First check if we got a timeout
  if (response.status === 408) {
    throw new Error(`Request timed out: ${response.data.message}`);
  }
  
  const validationMessages = [
    'User ID and password are required',
    'User ID cannot be empty', 
    'Password is required',
    'Password must be at least 8 characters long'
  ];
  
  if (response.status === 400 && response.data.message) {
    const isValidationError = validationMessages.some(msg => 
      response.data.message.includes(msg)
    );
    expect(isValidationError).to.be.false;
  }
});

// Helper function to submit credentials
async function submitCredentials(userId, password) {
  const requestBody = {};
  
  if (userId !== undefined) {
    requestBody.userId = userId === '""' ? '' : userId;
  }
  
  if (password !== undefined) {
    requestBody.password = password === '""' ? '' : password;
  }

  try {
    response = await axios.post(`${BASE_URL}/users/login`, requestBody);
  } catch (error) {
    response = error.response;
  }
}