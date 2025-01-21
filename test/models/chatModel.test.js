const Chat = require('../../models/chatModel');
const db = require('../../config/db');

jest.mock('../../config/db');

describe('Chat Model', () => {
  describe('create', () => {
    it('should create a new chat message', () => {
      const message = { project_id: 1, user_id: 1, message: 'Hello' };
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      Chat.create(message, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual({ insertId: 1 });
      });
    });
  });

  describe('findByProjectId', () => {
    it('should return chats for a given projectId', () => {
      const projectId = 1;
      const chats = [{ message: 'Hello' }];
      db.query.mockImplementation((query, values, callback) => {
        callback(null, chats);
      });

      Chat.findByProjectId(projectId, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(chats);
      });
    });
  });
});