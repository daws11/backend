const Project = require('../../models/projectModel');
const db = require('../../config/db');

jest.mock('../../config/db');

describe('Project Model', () => {
  describe('create', () => {
    it('should create a new project', () => {
      const project = {
        name: 'New Project',
        jobOwner: 'Owner',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        projectWarrantyDuration: 12,
        contractValue: 1000000,
        sourceOfFunds: 'Internal',
        lineOfBusiness: 'IT',
        projectLeader: 1,
        hasProjectWarranty: true
      };
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      Project.create(project, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual({ insertId: 1 });
      });
    });
  });

  describe('findById', () => {
    it('should return a project by ID', () => {
      const id = 1;
      const project = [{ id: 1, name: 'Project 1' }];
      db.query.mockImplementation((query, values, callback) => {
        callback(null, project);
      });

      Project.findById(id, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(project);
      });
    });
  });
});