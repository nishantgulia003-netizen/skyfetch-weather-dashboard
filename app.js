function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";
    this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

    this.searchBtn = document.getElementById("search-btn");
    this.cityInput = document.getElementById("city-input");
    this.weatherDisplay = document.getElementById("weather-display");

    this.init();
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener(
        "click",
        this.handleSearch.bind(this)
    );

    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    });

    this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h2>🌤 SkyFetch</h2>
            <p>Search for any city to see weather and 5-day forecast.</p>
        </div>
    `;
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = "";
};

WeatherApp.prototype.getWeather = async function (city) {
    this.showLoading();

    try {
        const [currentRes, forecastRes] = await Promise.all([
            axios.get(
                `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`
            ),
            axios.get(
                `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`
            )
        ]);

        this.displayWeather(currentRes.data);
        this.displayForecast(forecastRes.data);

    } catch (error) {
        console.error(error);
        this.showError("City not found or something went wrong.");
    }
};

WeatherApp.prototype.displayWeather = function (data) {
    const html = `
        <div class="weather-info">
            <h2>${data.name}</h2>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
            <h3>${Math.round(data.main.temp)}°C</h3>
            <p>${data.weather[0].description}</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = html;
};

WeatherApp.prototype.processForecastData = function (data) {
    const daily = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return daily.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (data) {
    const days = this.processForecastData(data);

    const forecastHTML = days.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        return `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                <p>${Math.round(day.main.temp)}°C</p>
                <small>${day.weather[0].description}</small>
            </div>
        `;
    }).join("");

    this.weatherDisplay.innerHTML += `
        <div class="forecast-section">
            <h3>5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;
};

WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="loading-container">
            <p>Loading weather data...</p>
        </div>
    `;
};

WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            ❌ ${message}
        </div>
    `;
};

const app = new WeatherApp('5de8480201e2e47d9a7963529e42c15d');
