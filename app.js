const API_KEY = '5de8480201e2e47d9a7963529e42c15d';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

async function getWeather(city) {

    showLoading();

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        displayWeather(response.data);
    } catch (error) {

        if (error.response && error.response.status === 404) {
            showError('City not found. Please check spelling.');
        } else {
            showError('Something went wrong. Try again later.');
        }

    }
}

function displayWeather(data) {

    const city = data.name;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2>${city}</h2>
            <img src="${iconUrl}">
            <h3>${temp}°C</h3>
            <p>${desc}</p>
        </div>
    `;

    cityInput.focus();
}

function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather...</p>
        </div>
    `;
}

searchBtn.addEventListener('click', function () {

    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    getWeather(city);
    cityInput.value = '';
});

cityInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});


