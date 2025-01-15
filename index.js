const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const PORT = 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const AIR_QUALITY_API_KEY = process.env.AIR_QUALITY_API_KEY;
const AIR_QUALITY_BASE_URL = 'http://api.openweathermap.org/data/2.5/air_pollution';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_BASE_URL = 'https://newsapi.org/v2/everything';
app.use(express.static('public'));
app.get('/api/weather', async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City is required' });
    try {
        const weatherResponse = await axios.get(OPENWEATHER_BASE_URL, {
            params: { q: city, appid: OPENWEATHER_API_KEY, units: 'metric' },
        });
        const data = weatherResponse.data;
        res.json({
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            description: data.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            coordinates: { lat: data.coord.lat, lon: data.coord.lon },
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            wind_speed: data.wind.speed,
            country_code: data.sys.country,
            rain_volume: data.rain ? data.rain['3h'] : 0,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
app.get('/api/air_quality', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Latitude and Longitude are required' });
    try {
        const airQualityResponse = await axios.get(AIR_QUALITY_BASE_URL, {
            params: { lat, lon, appid: AIR_QUALITY_API_KEY },
        });
        res.json(airQualityResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch air quality data' });
    }
});
app.get('/api/news', async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City is required' });
    try {
        const newsResponse = await axios.get(NEWS_BASE_URL, {
            params: { q: city, apiKey: NEWS_API_KEY },
        });
        res.json(newsResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
