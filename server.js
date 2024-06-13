const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(cors());

app.get('/api/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: 'City parameter is required' });
  }

  try {
    const apiKey = '332c6cbf5a3c3f1be11e7bd94d300ee0'; // Replace with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(apiUrl);
    console.log('API response:', response.data); // Log the API response for debugging

    if (response.data && response.data.list) {
      const hourlyData = response.data.list.map((item) => ({
        time: item.dt_txt,
        temp: item.main.temp,
      }));

      const weatherData = {
        city: response.data.city.name,
        temperature: response.data.list[0].main.temp,
        description: response.data.list[0].weather[0].description,
        hourlyData,
      };

      res.json(weatherData);
    } else {
      res.status(500).json({ message: 'Invalid response from weather API' });
    }
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
