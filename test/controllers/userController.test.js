const UserController = require('../../controllers/userController');
const User = require('../../models/userModel');

jest.mock('../../models/userModel');

describe('UserController', () => {
  describe('getAllUsers', () => {
    it('should return all users', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const users = [{ id: 1, username: 'testuser' }];
      User.getAll.mockImplementation((callback) => {
        callback(null, users);
      });

      UserController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      };
      const user = [{ id: 1, username: 'testuser' }];
      User.findById.mockImplementation((id, callback) => {
        callback(null, user);
      });

      UserController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user[0]);
    });
  });
});