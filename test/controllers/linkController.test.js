const LinkController = require('../../controllers/linkController');
const db = require('../../config/db');

jest.mock('../../config/db');

describe('LinkController', () => {
  describe('getLinks', () => {
    it('should return links for a valid projectId', () => {
      const req = { params: { projectId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const links = [{ id: 1, source: 'Task 1', target: 'Task 2', type: '0' }];
      db.query.mockImplementation((query, values, callback) => {
        callback(null, links);
      });

      LinkController.getLinks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(links);
    });
  });

  describe('createLink', () => {
    it('should create a new link with valid data', () => {
      const req = {
        params: { projectId: '1' },
        body: { source: 'Task 1', target: 'Task 2', type: '0' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      LinkController.createLink(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, type: '0' });
    });
  });
});