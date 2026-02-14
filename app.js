const API_KEY = '5de8480201e2e47d9a7963529e42c15d';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function getWeather(city) {

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    axios.get(url)
        .then(function(response) {
            displayWeather(response.data);
        })
        .catch(function(error) {
            document.getElementById('weather-display').innerHTML =
                '<p>Failed to fetch weather.</p>';
        });
}

function displayWeather(data) {

    const city = data.name;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const html = `
        <h2>${city}</h2>
        <img src="${iconUrl}">
        <h3>${temp}°C</h3>
        <p>${desc}</p>
    `;

    document.getElementById('weather-display').innerHTML = html;
}

getWeather('paris');
