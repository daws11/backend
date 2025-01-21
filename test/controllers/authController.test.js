const AuthController = require('../../controllers/authController');
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  describe('register', () => {
    it('should register a new user with valid data', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password',
          role: 'user',
          name: 'Test User',
          email: 'test@example.com'
        },
        file: { filename: 'photo.jpg' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.create.mockImplementation((username, password, role, name, email, photoProfile, callback) => {
        callback(null, { id: 1 });
      });

      await AuthController.register[1](req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      };
      const user = [{ id: 1, username: 'testuser', password: 'hashedpassword', role: 'user', name: 'Test User', email: 'test@example.com', photo_profile: 'photo.jpg' }];
      User.findByUsername.mockImplementation((username, callback) => {
        callback(null, user);
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'token');
      });

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'token', user: user[0] });
    });
  });
});