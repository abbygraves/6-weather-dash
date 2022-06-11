dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);



var cityForm = document.querySelector("#city-form");
var cityInput = document.querySelector("#city-input");
var cityNameEl = document.querySelector("#city-name");
var currentDateEl = document.querySelector("#date");
var weatherIconEl = document.querySelector("#weather-icon");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var uvIndexEl = document.querySelector("#uv-index");
var dailyWeatherEl = document.querySelector("#daily-weather");
var cityArray = [];
var cityHistoryEl = document.querySelector("#city-history");

function formSubmitHandler(event) {
  event.preventDefault();
  var city = cityInput.value.trim();
  
  if (city) {
    saveCityHistory(city);
    getWeather(city);
    cityInput.value = "";
  } else {
    alert("Please enter a city");
  }
};

function saveCityHistory(city) {
  cityArray.push(city);
  console.log(cityArray)
  localStorage.setItem("cityArray", JSON.stringify(cityArray));
 
};

function loadCityHistory() {
  var saveCityHistory = JSON.parse(localStorage.getItem("cityArray"));
  console.log(saveCityHistory)
  // check around here
  if (cityArray) {
    for (let i = 0; cityArray.length; i++) {
      var historyButtonEl = document.createElement("button");
      historyButtonEl.textContent = cityArray[i];
      cityHistoryEl.appendChild(historyButtonEl);
      
    }
  }
};


function getWeather(location) {
  var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=f3abb8e7ac5dca95fb34c9719d493299&units=imperial";

  fetch(apiUrl).then(function (response) {
    // request was succesful
    if (response.ok) {
      response.json().then(function (data) {
        getLatLong(data);
        displayWeather(data, location);
      });
    }
  })
};

function getLatLong(data) {
  var locationLat = data.coord.lat;
  var locationLon = data.coord.lon;
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + locationLat + "&lon=" + locationLon + "&appid=f3abb8e7ac5dca95fb34c9719d493299";

  fetch(apiUrl).then(function (response) {
    // request was succesful
    if (response.ok) {
      response.json().then(function (data) {
        displayUV(data);
        // console.log(data.timezone)
        // console.log(dayjs().tz(data.timezone).add(1, "day").startOf("day").format("M/D/YYYY"))
        displayDailyWeather(data.daily, data.timezone);
      });
    }
  })
};

function displayDailyWeather(dailyWeather, timezone) {
  console.log(dayjs().tz(timezone).add(1, "day").startOf("day").format("M/D/YYYY"))
  for (let i = 0; i < 5; i++) {
    console.log(dailyWeather[i])

    // make the elements
    var dateEl = document.createElement("h5");
    var humidityDailyEl = document.createElement("p");
    var rightNow1 = dayjs().tz(timezone).add(i, "day").startOf("day").format("M/D/YYYY");

    // assigning values to elements
    dateEl.textContent = rightNow1;
    humidityDailyEl.textContent = dailyWeather[i].humidity;

    // append them all
    dailyWeatherEl.appendChild(dateEl);
    dailyWeatherEl.appendChild(humidityDailyEl);
    
  }
};


function displayWeather(data) {
  cityNameEl.textContent = data.name;
  tempEl.textContent = "Temp: " + data.main.temp + "°F";
  windEl.textContent = "Wind: " + data.wind.speed + " MPH";
  humidityEl.textContent = "Humidity: " + data.main.humidity + " %";

  var timezone = data.timezon
  
  var rightNow = dayjs().tz(timezone).add(1, "day").startOf("day").format("M/D/YYYY");
  currentDateEl.textContent = rightNow;
  // (for i = 0 )

  var iconCode = data.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
  $('#wicon').attr('src', iconUrl);
  
};


function displayUV(data) {
  uvIndexEl.textContent = "UV Index: " + data.current.uvi;

  if (data.current.uvi <= 2) {
    uvIndexEl.classList = "uv-low";
  }
  else if (data.current.uvi >= 3 && data.current.uvi <= 5) {
    uvIndexEl.classList = "uv-med";
  }
  else if (data.current.uvi >= 6 && data.current.uvi <= 7) {
    uvIndexEl.classList = "uv-high";
  }
  else if (data.current.uvi >= 8 && data.current.uvi <= 11) {
    uvIndexEl.classList = "uv-extreme";
  }
};


cityForm.addEventListener("submit", formSubmitHandler);
// loadCityHistory();




// NEED TO DISPLAY: 
// - City name
// - Date
// - Icon rep. of weather conditions
// - Temp
// - Humidity
// - Wind speed
// - UV index

// TO ADD A DAY - MAKE A FOR LOOP REPLACE 1 WITH i AND LOOP TRHU 5 DAYS
//console.log(dayjs().tz(timezone).add(1, "day").startOf("day").format("M/D/YYYY"))