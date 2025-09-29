const request = require('supertest');
const app = require('../../app');
const UserModel = require('../../models/userModel');

// Mock the UserModel to control its behavior in tests
jest.mock('../../models/userModel');

describe('POST /api/users/login - Password Validation', () => {

  //clear mock history before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST 1: Should reject short passwords
  it('should return a 400 error if password is less than 8 characters', async () => {
    // 1. ARRANGE: Define the invalid input
    const loginRequestWithShortPassword = {
      userId: 'cashier1',
      password: 'abc' // Clearly less than 8 chars
    };

    // 2. ACT: Send the request to login endpoint
    const response = await request(app)
      .post('/api/users/login')
      .send(loginRequestWithShortPassword);

    // 3. ASSERT: Define what the correct response should be
    // These assertions will FAIL (RED) because the validation logic isn't implemented.
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password must be at least 8 characters long');

    // Ensure the database was NOT called
    expect(UserModel.findOne).not.toHaveBeenCalled();
  });

  // TEST 2: Should proceed with valid passwords
  it('should call the database if password is 8 characters or more', async () => {
    // 1. ARRANGE
    // a. Define valid input
    const loginRequestWithValidPassword = {
      userId: 'cashier1',
      password: 'validlongpassword' // 8+ chars
    };
    // b. Tell the mock what to return when findOne is called
    UserModel.findOne.mockResolvedValueOnce(null); // Simulate user not found

    // 2. ACT
    const response = await request(app)
      .post('/api/users/login')
      .send(loginRequestWithValidPassword);

    // 3. ASSERT
    // Expect a error since user doesn't exist, meaning we passed validation
    expect(UserModel.findOne).toHaveBeenCalledTimes(1);
    // Expect it to be called with the correct arguments
    expect(UserModel.findOne).toHaveBeenCalledWith({
      userId: 'cashier1',
      password: 'validlongpassword',
      verified: true
    });
  });
});