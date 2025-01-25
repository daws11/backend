const Project = require('../models/projectModel');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    res.status(500).send('Server error');
  }
};

exports.getTeamMembersByProject = async (req, res) => {
  const { id } = req.params;
  try {
    const teamMembers = await Project.getTeamMembersByProject(id);
    res.status(200).json(teamMembers);
  } catch (err) {
    console.error('Failed to fetch team members:', err);
    res.status(500).send('Server error');
  }
};

exports.createProject = async (req, res) => {
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
    hasProjectWarranty,
    teamMembers // Expecting an array of user IDs
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

  try {
    // Create project
    const result = await Project.create(newProject);
    const projectId = result.insertId;
    console.log('Created Project ID:', projectId);

    // Add team members to the project
    if (teamMembers && teamMembers.length > 0) {
      await Project.addTeamMembers(projectId, teamMembers);
      console.log('Team Members Added:', teamMembers);
    }
    res.status(201).send({ projectId });
  } catch (err) {
    console.error('Failed to create project:', err);
    res.status(500).send('Server error');
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    const teamMembers = await Project.getTeamMembersByProject(id);
    const projectDetails = {
      ...project,
      teamMembers
    };

    res.status(200).json(projectDetails);
  } catch (err) {
    console.error('Failed to fetch project:', err);
    res.status(500).send('Server error');
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Project.deleteById(id);
    if (result.affectedRows === 0) {
      return res.status(404).send('Project not found');
    }
    res.status(200).send(`Project with id ${id} deleted.`);
  } catch (err) {
    console.error('Failed to delete project:', err);
    res.status(500).send('Server error');
  }
};