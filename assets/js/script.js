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
var cityArray;
var cityHistoryEl = document.querySelector("#city-history");


function formSubmitHandler(event) {
  event.preventDefault();
  var city = cityInput.value.trim();

  if (city) {
    saveCityHistory(city);
    getWeather(city);
    cityInput.value = "";
    dailyWeatherEl.textContent = "";
    loadCityHistory();
  } else {
    alert("Please enter a city");
  }
};


function saveCityHistory(city) {
  if (typeof cityArray === "undefined") {
    cityArray = [];
  }
  cityArray.push(city);
  console.log(cityArray)
  localStorage.setItem("cityArray", JSON.stringify(cityArray));

};


function loadCityHistory() {
  var savedCityHistory = JSON.parse(localStorage.getItem("cityArray"));
  // console.log(savedCityHistory)

  if (savedCityHistory !== null) {
    cityArray = savedCityHistory;
  }
  if (typeof cityArray === "undefined") {
    cityArray = [];
  } else {
    for (let i = 0; i < cityArray.length; i++) {

      var button = document.createElement('button');
      button.classList = 'btn btn-history w-100';
      button.textContent = cityArray[i];
      button.addEventListener('click', function () { getLatLong(cityArray[i]) })
      // console.log(button)
      // console.log(cityHistoryEl)
      cityHistoryEl.appendChild(button)
    }
    // console.log('loadCityHistory')
  }
};


function getWeather(location) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=f3abb8e7ac5dca95fb34c9719d493299&units=imperial";

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
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + locationLat + "&lon=" + locationLon + "&appid=f3abb8e7ac5dca95fb34c9719d493299&units=imperial";

  fetch(apiUrl).then(function (response) {
    // request was succesful
    if (response.ok) {
      response.json().then(function (data) {
        displayUV(data);
        displayDailyWeather(data.daily, data.timezone);
      });
    }
  })
};


function displayWeather(data) {
  cityNameEl.textContent = data.name;
  tempEl.textContent = "Temp: " + data.main.temp + "°F";
  windEl.textContent = "Wind: " + data.wind.speed + " MPH";
  humidityEl.textContent = "Humidity: " + data.main.humidity + " %";

  var timezone = data.timezon

  var rightNow = dayjs().tz(timezone).add(0, "day").startOf("day").format("M/D/YYYY");
  currentDateEl.textContent = rightNow;

  var iconCode = data.weather[0].icon;
  var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
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



function displayDailyWeather(dailyWeather, timezone) {
  // console.log(dayjs().tz(timezone).add(1, "day").startOf("day").format("M/D/YYYY"))
  for (let i = 1; i < 6; i++) {
    // console.log(dailyWeather[i])

    // make the elements
    var card = document.createElement("div")
    var dateDailyEl = document.createElement("h5");
    // var iconCode = dailyWeather[i].weather.icon;
    // var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
    var humidityDailyEl = document.createElement("p");
    var rightNow1 = dayjs().tz(timezone).add(i, "day").startOf("day").format("M/D/YYYY");
    var tempDailyEl = document.createElement("p");
    var windDailyEl = document.createElement("p");

    // assigning values to elements
    dateDailyEl.textContent = rightNow1;
    // $('#wicon').attr('src', iconUrl);
    tempDailyEl.textContent = "Temp: " + dailyWeather[i].temp.day + "°F";
    windDailyEl.textContent = "Wind: " + dailyWeather[i].wind_speed + " MPH"
    humidityDailyEl.textContent = "Humidity: " + dailyWeather[i].humidity + " %";

    // append them all
    card.appendChild(dateDailyEl);
    // card.appendChild(iconEl);
    card.appendChild(tempDailyEl);
    card.appendChild(windDailyEl);
    card.appendChild(humidityDailyEl);
    card.setAttribute("class", "col-md card")
    dailyWeatherEl.appendChild(card);
  }
};


loadCityHistory();
cityForm.addEventListener("submit", formSubmitHandler);



