//*custom API Key
let apiKey = "af6e7cee0e853a37f2ef23f0b8781824";

let city;
let resultsCard = $(".main-weather-body");
let searchBtn = $("#search-city");
let info = $(".info");
const mainCard = document.querySelector(".main-weather");
const forecastWrap = $(".forecast-wrap");

//*listed items
let searchHistory = [];

//*fetch data for main card
function fetchData() {
  let queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    //*using moment to get the current date
    let date = moment().format(" MM/DD/YYYY");

    let iconCode = response.weather[0].icon;
    let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";

    // main card CSS
    mainCard.style.background = "rgb(22, 150, 241)";
    mainCard.style.borderRadius = "15px";

    //* displays city in main card
    let name = $("<h3>").addClass("city-name").html(city);
    resultsCard.prepend(name);

    let mainDate = $("<p>").addClass("main-date").html(date);
    resultsCard.prepend(mainDate);

    resultsCard.append($("<img>").attr("src", iconURL));
    //* converts from Kelvin
    let temp = Math.round((response.main.temp - 273.15) * 1.8 + 32);
    resultsCard.append(
      $("<p>")
        .addClass("main-temp")
        .html(temp + " &#8457")
    );

    let humidity = response.main.humidity;
    resultsCard.append($("<p>").html("Humidity: " + humidity));

    let windSpeed = response.wind.speed;
    resultsCard.append($("<p>").html("Wind Speed: " + windSpeed));

    //* identifying lon and lat
    //* grabs coordinates from api object
    let lat = response.coord.lat;

    let lon = response.coord.lon;

    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi?appid=" +
        apiKey +
        "&lat=" +
        lat +
        "&lon=" +
        lon,
      method: "GET",
      //* displays UV in main card
    }).then(function (response) {
      resultsCard.append(
        $("<p>").html("UV Index: <span>" + response.value + "</span>")
      );

      if (response.value <= 2) {
        //* changing UV color
        $("span").attr("class", "btn btn-outline-success");
      }
      if (response.value > 2 && response.value <= 5) {
        $("span").attr("class", "btn btn-outline-warning");
      }
      if (response.value > 5) {
        $("span").attr("class", "btn btn-outline-danger");
      }
    });

    //* forecast cards
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=" +
        apiKey,
      method: "GET",
    }).then(function (response) {
      // reveals the forecast title
      let forecastTitle = document.querySelector(".forecast-title");
      forecastTitle.classList.remove("hide");

      for (i = 0; i < 5; i++) {
        //* creates columns
        let weatherCard = $("<div>").attr("class", "weekday card col");
        $(".forecast-wrap").prepend(weatherCard);

        // adds the date to each weekday card
        let todaysDate = new Date(response.list[i * 5].dt * 1000);
        weatherCard.append($("<h4>").html(todaysDate.toLocaleDateString()));
        // adds the icons to each weekday card
        let iconCode = response.list[i * 5].weather[0].icon;

        let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        weatherCard.append($("<img>").attr("src", iconURL));

        //*converts it from Kelvin
        let temp = Math.round(
          (response.list[i * 8].main.temp - 273.15) * 1.8 + 32
        );
        weatherCard.append($("<p>").html("Temp: " + temp + " &#8457"));

        // adds the humidity level to each card
        let humidity = response.list[i * 8].main.humidity;
        weatherCard.append($("<p>").html("Humidity: " + humidity));
      }
    });
  });

  //*empties main card after each search
  resultsCard.empty();
  //*empties week forecast
  $(".forecast-wrap").empty();
}

fetchItems();

//*returns search history
function fetchItems() {
  let cityStorage = JSON.parse(localStorage.getItem("searchHistory"));
  if (cityStorage != null) {
    searchHistory = cityStorage;
  }

  for (i = 0; i < searchHistory.length; i++) {
    if (i == 10) {
      break;
    }

    cityListButton = $("<a>").attr({
      class: "list-group-item list-group-item-action",
      href: "#",
    });

    cityListButton.text(searchHistory[i]);
    $(".list-group").append(cityListButton);
  }
}

//*listens for click on search history
$(".list-group-item").click(function () {
  city = $(this).text();
  fetchData();
});

//* searches and adds to history
$("#search-city").click(function () {
  city = $("#city").val();
  fetchData();
  let arrayVerify = searchHistory.includes(city);
  if (arrayVerify == true) {
    return;
  } else {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    let cityListButton = $("<a>").attr({
      class: "list-group-item list-group-item-action",
      href: "#",
    });
    cityListButton.text(city);
    $(".list-group").append(cityListButton);
  }
});

// google maps
// let map;

// google maps init
// async function initMap() {
//   //@ts-ignore
//   const { Map } = await google.maps.importLibrary("maps");

//   map = new Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// }

// initMap();
