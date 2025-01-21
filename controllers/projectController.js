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

exports.getTeamMembersByProject = (req, res) => {
  const { id } = req.params;
  Project.getTeamMembersByProject(id, (err, teamMembers) => {
    if (err) {
      console.error('Failed to fetch team members:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(teamMembers);
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

  // Create project
  Project.create(newProject, (err, result) => {
    if (err) {
      console.error('Failed to create project:', err);
      return res.status(500).send('Server error');
    }

    const projectId = result.insertId;
    console.log('Created Project ID:', projectId);

    // Add team members to the project
    if (teamMembers && teamMembers.length > 0) {
      Project.addTeamMembers(projectId, teamMembers, (err) => {
        if (err) {
          console.error('Failed to add team members:', err);
          return res.status(500).send('Failed to add team members');
        }
        console.log('Team Members Added:', teamMembers);
        res.status(201).send({ projectId });
      });
    } else {
      res.status(201).send({ projectId });
    }
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

    Project.getTeamMembersByProject(id, (err, teamMembers) => {
      if (err) {
        console.error('Failed to fetch team members:', err);
        return res.status(500).send('Server error');
      }

      const projectDetails = {
        ...project[0],
        teamMembers
      };

      res.status(200).json(projectDetails);
    });
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
