var APIKey = "7c8cf45d028488694d242f6dad561637";
var citySearchEL = document.querySelector("#city-search");
var submitButtonEl = document.querySelector("submit-btn");

function convCityToCoor(event) {
    event.preventDefault();

    var citySearchVal = citySearchEL.value.trim();
    console.log(citySearchVal);

    if (!citySearchVal) {
        console.error('You need a search input value!');
        return;
    }

    var coordinates = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearchVal + '&limit=1&appid=' + APIKey;

    console.log(coordinates);

}

citySearchEL.addEventListener('submit', convCityToCoor);

