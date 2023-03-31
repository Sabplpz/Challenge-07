// API Key for the calls to OpenWeather
var APIKey = "7c8cf45d028488694d242f6dad561637";
// Grabbing the elements from the HTML
var citySearchEl = document.querySelector("#city-search");
var submitButtonEl = document.querySelector("#submit-btn");
var todaysWeatherEl = document.querySelector("#todays-weather");
var futureWeatherEl = document.querySelector("#future-weather");
var citiesListEl = document.querySelector("#last-cities-container");
var forecastTitleEl = document.querySelector("#forecast-title");
// Global variables
var lat;
var lon;
// var today = "";
// Global array for the search history
var searchHist = JSON.parse(localStorage.getItem("city")) || [];


function convCityToCoor(city) {

    var coordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIKey;

    fetch(coordinates)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            var tempLat = data[0].lat;
            lat = tempLat.toFixed(2);
            var tempLon = data[0].lon;
            lon = tempLon.toFixed(2);
            getTodaysWeather(city);
            getFutureWeather();
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

      displaySearchHistory();

}

function getTodaysWeather(city) {

    var weatherCall = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey;

    fetch(weatherCall)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            var temperature = data.list[0].main.temp;
            var wind = data.list[0].wind.speed;
            var humidity = data.list[0].main.humidity;
            var iconCode = data.list[0].weather[0].icon;
            var icon = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
            todaysWeatherEl.innerHTML = '';
            displayTodaysWeather(temperature, wind, humidity, icon, city);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

}

function displayTodaysWeather(temp, wind, hum, icon, city) {

    var date = dayjs().format('MMM D, YYYY');

    var dateEl = document.createElement('h2');
    var iconEl = document.createElement('img');
    iconEl.src = icon;
    dateEl.textContent = city + ' (' + date + ')';
    dateEl.appendChild(iconEl);
    todaysWeatherEl.appendChild(dateEl);

    var tempEl = document.createElement('p');
    tempEl.textContent = 'Temperature: ' + temp + " °F";
    todaysWeatherEl.appendChild(tempEl);

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind: ' + wind + " MPH";
    todaysWeatherEl.appendChild(windEl);

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + hum + "%";
    todaysWeatherEl.appendChild(humidityEl);

}

function getFutureWeather() {

    var weatherCall = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey;

    var titleEl = document.createElement('h4');
    forecastTitleEl.innerHTML='';
    titleEl.textContent = '5-Day Forecast:'
    forecastTitleEl.appendChild(titleEl);

    fetch(weatherCall)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            futureWeatherEl.innerHTML = '';
            for (var i = 1; i < 6; i++){
                var temperature = data.list[i].main.temp;
                var wind = data.list[i].wind.speed;
                var humidity = data.list[i].main.humidity;
                var iconCode = data.list[i].weather[0].icon;
                var icon = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
                displayFutureWeather(temperature, wind, humidity, icon, i);
            }
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

    
}

function displayFutureWeather(temp, wind, hum, icon, i) {

    var date = dayjs().add(i, 'day').format('MMM D, YYYY');

    var cardEl = document.createElement('div');
    cardEl.classList = 'card';

    var dateEl = document.createElement('h6');
    var iconEl = document.createElement('img');
    iconEl.src = icon;
    dateEl.textContent = date;
    dateEl.appendChild(iconEl);
    cardEl.appendChild(dateEl);

    var tempEl = document.createElement('p');
    tempEl.textContent = 'Temperature: ' + temp + " °F";
    cardEl.appendChild(tempEl);

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind: ' + wind + " MPH";
    cardEl.appendChild(windEl);

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + hum + "%";
    cardEl.appendChild(humidityEl);

    futureWeatherEl.appendChild(cardEl);
    
}


function getWeather() {
  var city = this.getAttribute("data-city");
  convCityToCoor(city);
}

 function displaySearchHistory() {

    citiesListEl.innerHTML = '';
    for (var i = 0; i < searchHist.length; i++){
        var buttonEl = document.createElement('button');
        buttonEl.classList = 'btn btn-secondary';
        buttonEl.setAttribute('type', 'button');
        buttonEl.textContent = searchHist[i];
        buttonEl.setAttribute("data-city", searchHist[i]);
        buttonEl.onclick = getWeather;
        citiesListEl.appendChild(buttonEl);
    }
} 



displaySearchHistory();

submitButtonEl.addEventListener("click", function(e){
  e.preventDefault();
  searchHist = JSON.parse(localStorage.getItem("city")) || [];

    var citySearchVal = citySearchEl.value.trim();
    searchHist.unshift(citySearchVal);

    localStorage.setItem("city", JSON.stringify(searchHist));

    if (!citySearchVal) {
        console.error('You need a search input value!');
        return;
    }

    convCityToCoor(citySearchVal);
})

