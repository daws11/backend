const User = require('../models/userModel');

exports.getAllUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(users);
  });
};

exports.updateUserStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  User.updateStatus(id, status, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
};

exports.getUserExecutions = (req, res) => {
  User.findByRole('user_execution', (err, users) => {
    if (err) {
      console.error('Failed to fetch users:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(users);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id, (err, user) => {
    if (err) {
      console.error('Failed to fetch user:', err);
      return res.status(500).send('Server error');
    }
    if (!user || user.length === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user[0]);
  });
};


