const express = require('express');
const path = require('path');
const vulnerabilityRoutes = require('./routes/vulnerabilityRoutes');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const app = express();


app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/', vulnerabilityRoutes);


// app.post('/api/login', async (req, res) => {
//   const { employeeId, password } = req.body;

//   try {
//     const [rows] = await db.query('SELECT * FROM users WHERE employeeId = ?', [employeeId]);
    
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const user = rows[0];

//     const passwordMatch = await bcrypt.compare(password, user.password);
    
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     res.json({ message: 'Login successful', user: { employeeId: user.employeeId, name: user.name } });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
app.post('/api/login', async (req, res) => {
  const { employeeId, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE employeeId = ?', [employeeId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // Direct comparison of plain text passwords
    const passwordMatch = password === user.password;
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
console.log("user",user);
    res.json({ message: 'Login successful', user: { employeeId: user.employeeId, name: user.name,Role: user.Role,Designation: user.designation } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/forgot_password', async (req, res) => {
  const { employeeId } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE employeeId = ?', [employeeId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Here you would generate a password reset token and send it via email
    // This example just returns a success message
    res.json({ message: 'Password reset link has been sent to your email' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { employeeId, name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (employeeId, name, password) VALUES (?, ?, ?)', [employeeId, name, hashedPassword]);
    
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/dashboard-stats', (req, res) => {
  const sql = 'SELECT * FROM EmployeeTasksInfo';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/completed-tasks', (req, res) => {
  const sql = 'SELECT * FROM EmployeeTasksInfo WHERE status = "completed"';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


