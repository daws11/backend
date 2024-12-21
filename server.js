const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
