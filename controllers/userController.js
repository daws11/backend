const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).send(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).send('Server error');
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await User.updateStatus(id, status);
    res.status(200).send(result);
  } catch (err) {
    console.error('Failed to update user status:', err);
    res.status(500).send('Server error');
  }
};

exports.getUserExecutions = async (req, res) => {
  try {
    const users = await User.findByRole('user_execution');
    res.status(200).json(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).send('Server error');
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Failed to fetch user:', err);
    res.status(500).send('Server error');
  }
};