// Global Variables
var citiesList = $("#city-list")
var cities = []

init();
function renderCities() {
    if (cities.length > 5) {
        cities.shift();
    }
    for (var i = 0; i < cities.length; i++) {
        let city = cities[i];
        let li = $("<li>")
        let button = $("<button>");
        button.text(city);
        button.attr("data-index", i);
        button.attr("style", "width: 100%")
        button.addClass("btn shadow-box hist-button text-black");
        li.append(button);
        $("#city-list").prepend(li);
        $("#city-list").prepend("<br>");
    }
}

function init() {

    $("#city-list").empty();
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }
    renderCities();
}

$(".search-button").on("click", function (event) {

    event.preventDefault();
    $("#current-day-forecast").empty();
    $("#five-day-forecast").empty();
    let searchHistory = $("#search-term").val().trim();
    if (searchHistory === "") {
        return;
    };

    cities.push(searchHistory)
    localStorage.setItem("cities", JSON.stringify(cities));
    queryURL = buildQueryUrl(searchHistory);
    let fiveDayQueryURL;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (data) {

        buildWeatherCardData(data);
        fiveDayQueryURL = buildFiveDayQueryUrl(data);
        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        }).then(function (fiveData) {
            buildFiveDayForecast(fiveData)
        })

        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?" + "lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=25dadb9b8e610c671590ee035a843d84"

        buildCurrentWeatherCard(searchHistory);

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (response) {
            let uvIndexEl = response.value
            uvIndexTag = $("<p>").text("UV Index: " + uvIndexEl)
            $(".current-day-weather").append(uvIndexTag)
        })
        $("#search-term").val(null)
        init();
    });
});



$("#city-list").on("click", "button", function () {

    $("#current-day-forecast").empty();
    $("#five-day-forecast").empty();
    let searchHistory = $(this).text();
    queryURLHist = buildQueryUrl(searchHistory);

    $.ajax({
        url: queryURLHist,
        method: "GET"
    }).then(function (data) {
        buildWeatherCardData(data)
        let uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?" + "lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=25dadb9b8e610c671590ee035a843d84"

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (response) {
            let uvIndexEl = response.value;
            uvIndexTag = $("<p>").text("UV Index: " + uvIndexEl);
            $(".current-day-weather").append(uvIndexTag);
        })

        fiveDayQueryURL = buildFiveDayQueryUrl(data);


        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        }).then(function (fiveData) {
            buildFiveDayForecast(fiveData)
        })
    })
})