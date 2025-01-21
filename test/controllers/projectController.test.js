const ProjectController = require('../../controllers/projectController');
const Project = require('../../models/projectModel');

jest.mock('../../models/projectModel');

describe('ProjectController', () => {
  describe('getProjects', () => {
    it('should return all projects', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const projects = [{ id: 1, name: 'Project 1' }];
      Project.findAll.mockImplementation((callback) => {
        callback(null, projects);
      });

      ProjectController.getProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(projects);
    });
  });

  describe('createProject', () => {
    it('should create a new project with valid data', () => {
      const req = {
        body: {
          name: 'New Project',
          jobOwner: 'Owner',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          projectWarrantyDuration: 12,
          contractValue: 1000000,
          sourceOfFunds: 'Internal',
          lineOfBusiness: 'IT',
          projectLeader: 1,
          hasProjectWarranty: true,
          teamMembers: [1, 2, 3]
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      Project.create.mockImplementation((data, callback) => {
        callback(null, { insertId: 1 });
      });
      Project.addTeamMembers.mockImplementation((projectId, userIds, callback) => {
        callback(null);
      });

      ProjectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ projectId: 1 });
    });
  });
});