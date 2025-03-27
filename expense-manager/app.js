import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';
import cors from 'cors'; // Import cors

const { Pool } = pkg;
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Add CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add your frontend URL(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'world',
  password: process.env.DB_PASSWORD || 'your_secure_password',
  port: process.env.DB_PORT || 5432,
});

// Check database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0]);
  }
});

// GET all expenses
app.get('/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a single expense
app.get('/expenses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    
    const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching expense:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create a new expense
app.post('/expenses', async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    
    // Validate input
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    
    if (!category || category.trim() === '') {
      return res.status(400).json({ error: 'Category is required' });
    }

    const result = await pool.query(
      'INSERT INTO expenses (description, amount, category) VALUES ($1, $2, $3) RETURNING *',
      [description.trim(), parseFloat(amount), category.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update an expense
app.put('/expenses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    
    const { description, amount, category } = req.body;
    
    // Validate input
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    
    if (!category || category.trim() === '') {
      return res.status(400).json({ error: 'Category is required' });
    }

    const result = await pool.query(
      'UPDATE expenses SET description = $1, amount = $2, category = $3 WHERE id = $4 RETURNING *',
      [description.trim(), parseFloat(amount), category.trim(), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE an expense
app.delete('/expenses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;