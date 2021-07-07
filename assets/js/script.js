

//*custom API Key
let apiKey = "af6e7cee0e853a37f2ef23f0b8781824"

let city;
let resultsCard = $(".card-body");
let searchBtn = $("#searchCity");


//*listed items
let searchHistory = [];




//*fetch data for main card
function fetchData() {


    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey
    

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //*using moment to get the current date
        let date = moment().format(" MM/DD/YYYY");
        
        let iconCode = response.weather[0].icon;
        let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        
        //* displays city in main card
        let name = $("<h2>").html(city + date);
        resultsCard.prepend(name);

        
        resultsCard.append($("<img>").attr("src", iconURL));
        //* converts from Kelvin
        let temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        resultsCard.append($("<p>").html("Temperature: " + temp + " &#8457"));

        let humidity = response.main.humidity;
        resultsCard.append($("<p>").html("Humidity: " + humidity));

        let windSpeed = response.wind.speed;
        resultsCard.append($("<p>").html("Wind Speed: " + windSpeed));

        
        //* identifying lon and lat
        //* grabs coordinates from api object
        let lat = response.coord.lat;

        let lon = response.coord.lon;
       

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey +  "&lat=" + lat + "&lon=" + lon,
            method: "GET"
        //* displays UV in main card
        }).then(function (response) {

            resultsCard.append($("<p>").html("UV Index: <span>" + response.value + "</span>"));
            
            if (response.value <= 2) {
                //* changing UV color 
                $("span").attr("class", "btn btn-outline-success");
            };
            if (response.value > 2 && response.value <= 5) {
                $("span").attr("class", "btn btn-outline-warning");
            };
            if (response.value > 5) {
                $("span").attr("class", "btn btn-outline-danger");
            };
        })
        
        //* forcast cards
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey,
            method: "GET"
        
        }).then(function (response) {
            for (i = 0; i < 5; i++) {
                //* creates columns
                let weatherCard = $("<div>").attr("class", "weekcard col five text-white p-4");
                $("#forecast").append(weatherCard);
                
                let todaysDate = new Date(response.list[i * 8].dt * 1000);                
                weatherCard.append($("<h4>").html(todaysDate.toLocaleDateString()));
                
                let iconCode = response.list[i * 8].weather[0].icon;
                
                let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                weatherCard.append($("<img>").attr("src", iconURL));
                //*converts it from Kelvin
                let temp = Math.round((response.list[i * 8].main.temp - 273.15) * 1.80 + 32); 
                weatherCard.append($("<p>").html("Temp: " + temp + " &#8457"));
                
                let humidity = response.list[i * 8].main.humidity;
                weatherCard.append($("<p>").html("Humidity: " + humidity));
            }
        })
    })

    //*empties main card after each search
    resultsCard.empty();
    //*empties week forcast
    $("#forcastcards").empty();
     
};

fetchItems();

//*returns search history
function fetchItems() {
    let cityStorage = JSON.parse(localStorage.getItem("searchHistory"));
    if (cityStorage != null) {
        searchHistory = cityStorage;
    };
     
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 10) {
            break;
          }
        
        cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        
        cityListButton.text(searchHistory[i]);
        $(".list-group").append(cityListButton);
    }
};

//*listens for click on search history
$(".list-group-item").click(function() {
    city = $(this).text();
    fetchData();
});

//* searches and adds to history
$("#searchCity").click(function() {
    city = $("#city").val();
    fetchData();
    let arrayVerify = searchHistory.includes(city);
    if (arrayVerify == true) {
        return
    }
    else { 
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        let cityListButton = $("<a>").attr({
            
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityListButton.text(city);
        $(".list-group").append(cityListButton);
    };
});

