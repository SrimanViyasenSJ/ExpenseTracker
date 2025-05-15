const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Expense = require('./models/Expense'); // Expense model import

const app = express();
app.use(bodyParser.json());

// ✅ Connect to MongoDB (local)
mongoose.connect('mongodb://localhost:27017/expense-tracker')

.then(() => console.log('MongoDB connected locally'))
.catch(err => console.log('MongoDB connection error:',err));

// ✅ Route to add a new expense
app.post('/expenses', async (req, res) => {
  console.log("POST /expenses hit"); // Debug line

  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).send(expense);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// ✅ Route to get all expenses
app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.send(expenses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ✅ Start the server
app.get('/', (req, res) => {
    res.send('API is working');
  });
  
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
// ✅ Update an expense
app.put('/expenses/:id', async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExpense) {
      return res.status(404).send({ error: 'Expense not found' });
    }
    res.send(updatedExpense);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// ✅ Delete an expense
app.delete('/expenses/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).send({ error: 'Expense not found' });
    }
    res.send({ message: 'Expense deleted' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
