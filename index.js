const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end;
            return;
        }
        response.json(data);
    })
});

app.post('/api', (request, response) => {
    const data = request.body;
    database.insert(data);
    response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const weather_api_key = process.env.WEATHER_API_KEY;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api_key}&units=metric`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_api_key = process.env.AQ_API_KEY;
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat}%2C${lon}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'X-API-Key': aq_api_key,
        },
    }
    const aq_response = await fetch(aq_url, options);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data,
    }

    response.json(data);
});