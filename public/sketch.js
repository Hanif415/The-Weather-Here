let lat, lon;

if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition(async (position) => {
        let lat, lon, weather, air, temperature;
        try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;

            document.getElementById("latitude").textContent = lat.toFixed(2);
            document.getElementById("longitude").textContent = lon.toFixed(2);

            const api_url = `/weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const json = await response.json();
            console.log(json);
            weather = json.weather.weather[0];
            temperature = json.weather.main;
            air = json.air_quality.results[0].measurements[0];

            document.getElementById('summary').textContent = weather.description;
            document.getElementById('temperatures').textContent = temperature.temp;
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_values').textContent = air.value;
            document.getElementById('aq_units').textContent = air.unit;
            document.getElementById('aq_date').textContent = air.lastUpdated;
        } catch (error) {
            console.log('something went wrong');
            air = { value: -1 };
            document.getElementById('aq_values').textContent = 'NO READING';
        }

        const data = { lat, lon, weather, air, temperature };
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        const db_response = await fetch("/api", options);
        const db_json = await db_response.json();

        console.log(db_json);
    });
} else {
    console.log("geolocation not available");
}
