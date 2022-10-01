var today = new Date();
var cityFormEl = document.querySelector("#city-form");
var cityNameInputEl = document.querySelector("#cityname");
var currentWeatherEl = document.querySelector('#current-weather'); // body of the card
var currentWeatherCardEl = document.querySelector("#current-weather-card")
var fiveDayCardEl = document.querySelector("#five-day-card");
var fiveDayEl = document.querySelector("#five-day-body");
var weatherStatusEl = document.querySelector('#weather-status');
var searchEl = document.querySelector('#search');
var historyButtonsEl = document.querySelector("#history-buttons")
var historyCardEl = document.querySelector("#history")
var trashEl = document.querySelector("#trash")
var searchHistoryArray = []
var API_KEY = "41f99f0ae42a9594bfba8588d6d69cb2"



var formSubmitHandler = function (event) {
  event.preventDefault();
  // get city name value from input element
  var cityname = cityNameInputEl.value.trim();

  // Set city name in local storage and generate history buttons
  if (cityname) {
    searchHistoryArray.push(cityname);
    localStorage.setItem("weatherSearch", JSON.stringify(searchHistoryArray));
    var searchHistoryEl = document.createElement('button');
    searchHistoryEl.className = "btn";
    searchHistoryEl.setAttribute("data-city", cityname)
    searchHistoryEl.innerHTML = cityname;
    historyButtonsEl.appendChild(searchHistoryEl);
    historyCardEl.removeAttribute("style")
    getWeatherInfo(cityname);
    cityNameInputEl.value = "";
  }
  else {
    alert("Please enter a City name");
  }

}



// Get weather information from OpenWeather
var getWeatherInfo = function (cityname) {

  var apiCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=${API_KEY}`;
  // Make a fetch request using city name to get latitude and longitude for city
  fetch(apiCityUrl)
    .then(function (cityResponse) {
      return cityResponse.json();
    })
    .then(function (cityResponse) {
      // Create variables to hold the latitude and longitude of requested city
      console.log(cityResponse)
      var latitude = cityResponse.coord.lat;
      var longitude = cityResponse.coord.lon;

      // Create variables for City name, current date and icon information for use in current Weather heading
      var city = cityResponse.name;
      var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
      var weatherIcon = cityResponse.weather[0].icon;
      var weatherDescription = cityResponse.weather[0].description;
      const { temp, feels_like, humidity, temp_max, temp_min, pressure } = cityResponse.main;
      var weatherIconLink = `<img src='http://openweathermap.org/img/wn/${weatherIcon}@2x.png' alt='${weatherDescription}' title='${weatherDescription}' />`;

      // Empty Current Weather element for new data
      currentWeatherEl.textContent = "";

      // Update <h2> element to show city, date and icon
      weatherStatusEl.innerHTML = city + " (" + date + ") "; //  + weatherIconLink;

      // Remove class name 'hidden' to show current weather card
      currentWeatherCardEl.classList.remove("hidden");
      // display the weather Icon, and weather information (current temp, humidity, feels like, max and min temps)
      currentWeatherEl.innerHTML = `
        <div>${weatherIconLink} ${weatherDescription}</div>
        <div>Current Temperature ${temp} celsius</div>
        <div>Feels like ${feels_like} celsius</div>
        <div>Max Temperature ${temp_max} celsius</div>
        <div>Min Temperature ${temp_min} celsius</div>
        <div>Humidity ${humidity}% celsius</div>
      `;

      // Return a fetch request to the OpenWeather using longitude and latitude from pervious fetch
      // Get 5 day forcast
      const forcastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      return fetch(forcastUrl);
      //return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname},&limit=${2}&appid=='41f99f0ae42a9594bfba8588d6d69cb2'`)
    })
  .then(function (response) {
      // return response in json format
      return response.json();
  })
  .then(function (forcastData) {
      // send response data to displayFiveDayForcast function for final display 
      displayFiveDayForcast(forcastData);

  });
};

// Display the weather on page
var displayFiveDayForcast = function (weather) {
  console.log(weather);
  const nextFiveDays = [];
  for (let i = 0; i < weather.list.length; i += 8) {
    const dayForcast = weather.list[i];
    nextFiveDays.push(dayForcast);
  }
  console.log(nextFiveDays);

  // Empty Current Weather element for new data
  fiveDayEl.textContent = "";
  fiveDayCardEl.classList.remove("hidden");

  // create day sub cards under the main 5 day forcast
  for (let dayForcast of nextFiveDays) {
    const { temp } = dayForcast.main;
    const weatherIcon = dayForcast.weather[0].icon;
    var weatherDescription = dayForcast.weather[0].description;
    var weatherIconLink = `<img src='http://openweathermap.org/img/wn/${weatherIcon}@2x.png' alt='${weatherDescription}' title='${weatherDescription}' />`;
    
    const date = new Date(dayForcast.dt * 1000);
    const dateFormatted = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

    const singleDayForcast = document.createElement('div');
    singleDayForcast.innerHTML = `
      <div>${dateFormatted}</div>
      <div>${weatherIconLink} ${weatherDescription}</div>
      <div>Temperature ${temp} celsius</div>
    `;
    singleDayForcast.classList.add('five-day-forcast__single-day')
    
    fiveDayEl.appendChild(singleDayForcast);
  }



  // check if api returned any weather data
  // if (weather.length === 0) {
  //   weatherContainerEl.textContent = "No weather data found.";
  //   return;
  // }

  // // Create Temperature element
  // var temperature = document.createElement('p');
  // temperature.id = "temperature";
  // temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
  // currentWeatherEl.appendChild(temperature);

  // // Create Humidity element
  // var humidity = document.createElement('p');
  // humidity.id = "humidity";
  // humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.humidity + "%";
  // currentWeatherEl.appendChild(humidity);

  // // Create Wind Speed element
  // var windSpeed = document.createElement('p');
  // windSpeed.id = "wind-speed";
  // windSpeed.innerHTML = "<strong>Wind Speed:</strong> " + weather.current.wind_speed.toFixed(1) + " MPH";
  // currentWeatherEl.appendChild(windSpeed);

  // // Create uv-index element
  // var uvIndex = document.createElement('p');
  // var uvIndexValue = weather.current.uvi.toFixed(1);
  // uvIndex.id = "uv-index";
  // if (uvIndexValue >= 0) {
  //   uvIndex.className = "uv-index-green"
  // }
  // if (uvIndexValue >= 3) {
  //   uvIndex.className = "uv-index-yellow"
  // }
  // if (uvIndexValue >= 8) {
  //   uvIndex.className = "uv-index-red"
  // }
  // uvIndex.innerHTML = "<strong>UV Index:</strong> <span>" + uvIndexValue + "</span>";
  // currentWeatherEl.appendChild(uvIndex);

  // Get extended forecast data
  // var forecastArray = weather.daily;

  // // Create day cards for extended forecast
  // for (let i = 0; i < forecastArray.length - 3; i++) {
  //   var date = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear();
  //   var weatherIcon = forecastArray[i].weather[0].icon;
  //   var weatherDescription = forecastArray[i].weather[0].description;
  //   var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
  //   var dayEl = document.createElement("div");
  //   dayEl.className = "day";
  //   dayEl.innerHTML = "<p><strong>" + date + "</strong></p>" +
  //     "<p>" + weatherIconLink + "</p>" +
  //     "<p><strong>Temp:</strong> " + forecastArray[i].temp.day.toFixed(1) + "°F</p>" +
  //     "<p><strong>Humidity:</strong> " + forecastArray[i].humidity + "%</p>"

  //   fiveDayEl.appendChild(dayEl);
  // }

}

// Load any past city weather searches
var loadHistory = function () {
  searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

  if (searchArray) {
    searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
    for (let i = 0; i < searchArray.length; i++) {
      var searchHistoryEl = document.createElement('button');
      searchHistoryEl.className = "btn";
      searchHistoryEl.setAttribute("data-city", searchArray[i])
      searchHistoryEl.innerHTML = searchArray[i];
      historyButtonsEl.appendChild(searchHistoryEl);
      historyCardEl.removeAttribute("style");
    }

  }
}

// Search weather using search history buttons
var buttonClickHandler = function (event) {
  var cityname = event.target.getAttribute("data-city");
  if (cityname) {
    getWeatherInfo(cityname);
  }
}

// Clear Search History
var clearHistory = function (event) {
  localStorage.removeItem("weatherSearch");
  //historyCardEl.setAttribute("style", "display: none");
  historyButtonsEl.innerHTML = "";
}

cityFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler);
trashEl.addEventListener("click", clearHistory);

loadHistory()