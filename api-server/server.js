const express = require('express');
const cors = require('cors');
const app = express();
const data = require('./data.json');

app.use(cors());

app.get('/api/customers', (req, res) => {
  res.json(data.customers);
});

app.get('/api/transactions', (req, res) => {
  res.json(data.transactions);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
