var cityForm = document.querySelector("#city-form");
var cityInput = document.querySelector("#city-input");
var cityNameEl = document.querySelector("#city-name");
var currentDateEl = document.querySelector("#date");
var weatherIconEl = document.querySelector("#weather-icon");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var uvIndexEl = document.querySelector("#uv-index");
var currentDate = new Date();

function formSubmitHandler(event) {
  event.preventDefault();
  var city = cityInput.value.trim();

  if (city) {
    getWeather(city);
    cityInput.value = "";
  } else {
    alert("Please enter a city");
  }
};


function getWeather(location) {
  var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=f3abb8e7ac5dca95fb34c9719d493299&units=imperial";

  fetch(apiUrl).then(function (response) {
    // request was succesful
    if (response.ok) {
      response.json().then(function (data) {
        getLatLong(data, location);
        displayWeather(data, location);
        showDate();
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
      });
    }
  })
};

function showDate() {
  var rightNow = moment().format("(M/D/YYYY)");
  currentDateEl.textContent = rightNow;
};


function displayWeather(data) {
  cityNameEl.textContent = data.name;
  tempEl.textContent = "Temp: " + data.main.temp + "°F";
  windEl.textContent = "Wind: " + data.wind.speed + " MPH";
  humidityEl.textContent = "Humidity: " + data.main.humidity + " %";

  var iconCode = data.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
  $('#wicon').attr('src', iconUrl);
  console.log(data.weather[0].icon)
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


// NEED TO DISPLAY: 
// - City name
// - Date
// - Icon rep. of weather conditions
// - Temp
// - Humidity
// - Wind speed
// - UV index