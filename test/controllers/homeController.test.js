const HomeController = require('../../controllers/homeController');
const Project = require('../../models/projectModel');

jest.mock('../../models/projectModel');

describe('HomeController', () => {
  describe('getProjectNames', () => {
    it('should return project names', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const projectNames = [{ id: 1, name: 'Project 1' }];
      Project.getProjectNames.mockImplementation((callback) => {
        callback(null, projectNames);
      });

      HomeController.getProjectNames(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(projectNames);
    });
  });

  describe('getTasksByProjectId', () => {
    it('should return tasks for a valid projectId', () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const tasks = [{ id: 1, text: 'Task 1' }];
      Project.getTasksByProjectId.mockImplementation((id, callback) => {
        callback(null, tasks);
      });

      HomeController.getTasksByProjectId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tasks);
    });
  });
});