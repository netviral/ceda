const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/js', (req, res) => {
  res.sendFile(__dirname + '/client.js');
});

app.get('/api', async (req, res) => {
  try {
    const response = await axios.get('https://ecometer-api.ceda.ashoka.edu.in/reports/getAllData?varId=56');
    const data = response.data.data; // Use response.data.data

    // Check if x, y, and types arrays exist and have the same length
    if (data.x && data.y && data.type && data.x.length === data.y.length && data.y.length === data.type.length) {
      // Combine x, y, and types into an array of objects
      const chartData = data.x.map((_, i) => ({
        x: data.x[i],
        y: data.y[i]/10000,
        type: data.type[i]
      }));

      res.json(chartData);
    } else {
      res.status(500).json({ error: 'Invalid data format' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
