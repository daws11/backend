const TaskController = require('../../controllers/taskController');
const db = require('../../config/db');

jest.mock('../../config/db');

describe('TaskController', () => {
  describe('getTasks', () => {
    it('should return tasks for a valid projectId', () => {
      const req = { params: { projectId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const tasks = [{ id: 1, text: 'Task 1' }];
      db.query.mockImplementation((query, values, callback) => {
        callback(null, tasks);
      });

      TaskController.getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: tasks });
    });
  });

  describe('createTask', () => {
    it('should create a new task with valid data', () => {
      const req = {
        params: { projectId: '1' },
        body: { text: 'New task', start_date: '2023-01-01', duration: 1, progress: 0.0 }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      TaskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        text: 'New task',
        start_date: '2023-01-01 00:00:00',
        end_date: null,
        duration: 1,
        progress: 0.0,
        project_id: '1',
        parent_id: null,
        assigned_to: null,
        priority: '2'
      });
    });
  });
});