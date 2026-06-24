const currentDateTxt = document.querySelector(".current-date-txt");

const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");

const humidityTxt = document.querySelector(".humidity-value-txt");
const windTxt = document.querySelector(".wind-value-txt");

const weatherImg = document.querySelector(".weather-summary-img");

const forecastItemsContainer =document.querySelector(".forecast-items-container");
const weatherInfo = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found-section");
currentDateTxt.textContent =
new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short"
});

const apiKey = "afc19f913e71b4ec1a08c1b3b64e2008";

async function getForecast(city){

    const url =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    console.log("Forecast Data:", data);

    updateForecast(data);
}

async function getWeather(city){
    try{
        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        updateWeather(data);

        getForecast(city);

    }catch(error){
        console.error(error);
        alert("Failed to fetch weather data");
    }
}

const weatherIcons = {
    Clear: "assets/weather/clear.svg",
    Clouds: "assets/weather/clouds.svg",
    Rain: "assets/weather/rain.svg",
    Drizzle: "assets/weather/drizzle.svg",
    Thunderstorm: "assets/weather/thunderstorm.svg",
    Snow: "assets/weather/snow.svg",
    Atmosphere: "assets/weather/atmosphere.svg"
};

function updateForecast(data){

    if(data.cod !== "200"){
        console.log(data);
        return;
    }

    forecastItemsContainer.innerHTML = "";

    const dailyForecasts = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyForecasts.forEach(item => {

        const day = new Date(item.dt_txt)
            .toLocaleDateString("en-US", {
                weekday: "short"
            });

        const temp = Math.round(item.main.temp);

        const weatherMain = item.weather[0].main;

        const icon =
            weatherIcons[weatherMain] ||
            weatherIcons["Atmosphere"];

        forecastItemsContainer.insertAdjacentHTML(
            "beforeend",
            `
            <div class="forecast-item">
                <h5>${day}</h5>
                <img src="${icon}"
                     class="forecast-item-img">
                <h5>${temp}°C</h5>
            </div>
            `
        );
    });
}

function updateWeather(data){

  if(data.cod != 200){

    weatherInfo.style.display = "none";
    notFoundSection.style.display = "flex";

    return;
}

weatherInfo.style.display = "flex";
notFoundSection.style.display = "none";
    countryTxt.textContent =`${data.name}, ${data.sys.country}`;

    tempTxt.textContent =
    `${Math.round(data.main.temp)} °C`;

    conditionTxt.textContent =
    data.weather[0].main;

    humidityTxt.textContent =
    `${data.main.humidity}%`;

    windTxt.textContent =
    `${data.wind.speed} M/s`;

    weatherImg.src =
        weatherIcons[data.weather[0].main] ||
        weatherIcons["Atmosphere"];
}

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city !== ""){
        getWeather(city);
    }

});


cityInput.addEventListener("keydown", (e)=>{

    if(e.key === "Enter"){

        const city = cityInput.value.trim();

        if(city !== ""){
            getWeather(city);
        }
    }
});