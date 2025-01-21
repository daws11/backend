const ChatController = require('../../controllers/chatController');
const Chat = require('../../models/chatModel');

jest.mock('../../models/chatModel');

describe('ChatController', () => {
  describe('getChatsByProjectId', () => {
    it('should return 400 if projectId is not provided', () => {
      const req = { params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      ChatController.getChatsByProjectId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Project ID is required');
    });

    it('should return chats for a valid projectId', () => {
      const req = { params: { projectId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const chats = [{ message: 'Hello' }];
      Chat.findByProjectId.mockImplementation((projectId, callback) => {
        callback(null, chats);
      });

      ChatController.getChatsByProjectId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(chats);
    });
  });
});