const User = require('../../models/userModel');
const db = require('../../config/db');

jest.mock('../../config/db');

describe('User Model', () => {
  describe('create', () => {
    it('should create a new user', () => {
      const user = ['testuser', 'hashedpassword', 'user', 'Test User', 'test@example.com', 'photo.jpg'];
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      User.create(...user, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual({ insertId: 1 });
      });
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', () => {
      const username = 'testuser';
      const user = [{ id: 1, username: 'testuser' }];
      db.query.mockImplementation((query, values, callback) => {
        callback(null, user);
      });

      User.findByUsername(username, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(user);
      });
    });
  });
});