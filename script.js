const apiKey = "90b5e33373b9ea54f35cae84c4a1ab01"; 
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const bgContainer = document.getElementById("bg-container");

async function checkWeather(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      alert("City not found. Please try again!");
      return;
    }
    const data = await response.json();

    // 1. Update Weather UI
    document.getElementById("cityName").textContent = `Weather in ${data.name}`;
    document.getElementById("temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("desc").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // 2. Change Background Image
    // We use a high-res photo service and search by city name + buildings
    bgContainer.style.backgroundImage = `url('https://source.unsplash.com/featured/1600x900?${data.name},cityscape,buildings')`;

    // 3. Get Forecast
    fetchForecast(forecastUrl);
    
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

async function fetchForecast(url) {
  const res = await fetch(url);
  const data = await res.json();
  const forecastList = document.getElementById("forecast-list");
  forecastList.innerHTML = ""; 

  // Filter to get the midday weather for each of the next 5 days
  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
    forecastList.innerHTML += `
      <div class="forecast-item">
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
        <p><strong>${Math.round(day.main.temp)}°C</strong></p>
      </div>`;
  });
}

// Event Listeners
searchBtn.addEventListener("click", () => checkWeather(cityInput.value));
cityInput.addEventListener("keypress", (e) => { if (e.key === "Enter") checkWeather(cityInput.value); });

// Default city on startup
checkWeather("Stade");