const Project = require('../models/projectModel');

exports.getProjects = (req, res) => {
  Project.findAll((err, projects) => {
    if (err) {
      console.error('Failed to fetch projects:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(projects);
  });
};

exports.createProject = (req, res) => {
  const {
    name,
    jobOwner,
    startDate,
    endDate,
    projectWarrantyDuration,
    contractValue,
    sourceOfFunds,
    lineOfBusiness,
    projectLeader,
    hasProjectWarranty
  } = req.body;

  const newProject = {
    name,
    jobOwner,
    startDate,
    endDate,
    projectWarrantyDuration: hasProjectWarranty ? projectWarrantyDuration : null,
    contractValue,
    sourceOfFunds,
    lineOfBusiness,
    projectLeader,
    hasProjectWarranty
  };

  Project.create(newProject, (err, result) => {
    if (err) {
      console.error('Failed to create project:', err);
      return res.status(500).send('Server error');
    }
    res.status(201).send(result);
  });
};

exports.getProjectById = (req, res) => {
  const { id } = req.params;
  Project.findById(id, (err, project) => {
    if (err) {
      console.error('Failed to fetch project:', err);
      return res.status(500).send('Server error');
    }
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.status(200).json(project[0]); // Ensure the project is returned correctly
  });
};

exports.deleteProject = (req, res) => {
  const { id } = req.params;
  Project.deleteById(id, (err) => {
    if (err) {
      console.error('Failed to delete project:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).send(`Project with id ${id} deleted.`);
  });
};
