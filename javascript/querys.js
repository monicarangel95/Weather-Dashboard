// WHEN I search for a city
// THEN I am presented with current and future conditions 
// for that city and that city is added to the search history
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
// ```
function buildQueryUrl(searchHistory) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?";
    let queryParams = { "appid": "25dadb9b8e610c671590ee035a843d84" };
    queryParams.q = searchHistory
    queryParams.units = "imperial"
    return queryURL + $.param(queryParams);
}

function buildFiveDayQueryUrl(data) {
    let fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?";
    let fiveDayQueryParams = { "appid": "25dadb9b8e610c671590ee035a843d84" };
    fiveDayQueryParams.id = data.id;
    fiveDayQueryParams.units = "imperial";
    return fiveDayQueryURL + $.param(fiveDayQueryParams);
}

function buildCurrentWeatherCard(data, weatherData, weatherCard, cityDateEl, tempEl, humidityEl, windspeedEl, weathericon) {
    $(weatherCard).append(cityDateEl);
    $(weatherCard).append(weathericon)
    $(weatherCard).append(tempEl);
    $(weatherCard).append(humidityEl);
    $(weatherCard).append(windspeedEl);
    $("#current-day-forecast").append(weatherCard);
}

function buildWeatherCardData(data) {
    var date = moment().format("MMM Do YY");
    var weatherData = data;
    var currentWeatherIcon = data.weather[0].icon;
    var currentWeatherIconEl = "https://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
    var weathericon = $("<img/>", {
        id: "weather-icon",
        src: currentWeatherIconEl,
        width: 75
    });
    var currentTemp = Math.floor(weatherData.main.temp);
    var weatherCard = $("<div>").addClass("card weather-card opacity-4 text-black font-weight-bold border border-white current-day-weather");
    var cityDateEl = $("<h5>").addClass("card-title").text(weatherData.name + " " + "(" + date + ")");
    var tempEl = $("<p>").addClass("card-text").text("Temp: " + currentTemp + " F");
    var humidityEl = $("<p>").addClass("card-text text-nowrap").text("Humidity: " + weatherData.main.humidity + " %");
    var windspeedEl = $("<p>").addClass("card-text").text("Windspeed: " + weatherData.wind.speed + " mph");

    buildCurrentWeatherCard(data, weatherData, weatherCard, cityDateEl, tempEl, humidityEl, windspeedEl, weathericon);
}

function buildFiveDayForecast(fiveData) {

    fiveDayList = fiveData.list;
    for (var i = 4; i < fiveDayList.length; i += 8) {
        let day = fiveDayList[i];
        let dateYear = day.dt_txt.slice(0, 4);
        let dateMonth = day.dt_txt.slice(5, 7);
        let dateDay = day.dt_txt.slice(8, 10)
        let dayIcon = day.weather[0].icon;
        let dayWeatherIcon = "https://openweathermap.org/img/wn/" + dayIcon + ".png";
        let dayIconEl = $("<img/>", {
            id: "weather-icon",
            src: dayWeatherIcon,
            width: 50
        })
        let dayTempEl = Math.floor(day.main.temp);
        let dayCard = $("<div>").addClass("card weather-card col-lg border border-white opacity-4 text-black font-weight-bold mr-md-2 mb-3");
        let dayDate = $("<h5>").attr("style", "font-size:100%").addClass("card-title text-nowrap").text(`${dateMonth}/${dateDay}/${dateYear}`);
        let dayTemp = $("<p>").addClass("card-text").text("Temp: " + dayTempEl + " F");
        let dayHum = $("<p>").addClass("card-text text-nowrap").text("Humidity: " + day.main.humidity);
        $(dayCard).append(dayDate);
        $(dayCard).append(dayIconEl)
        $(dayCard).append(dayTemp);
        $(dayCard).append(dayHum);
        $("#five-day-forecast").append(dayCard);
    }
}

