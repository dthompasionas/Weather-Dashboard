let apiKey = "af6e7cee0e853a37f2ef23f0b8781824";
let searchBtn = document.getElementById("btn-search");


function searchValue () {

    let searchValue = document.getElementById('search-input').value.toLowerCase();
    console.log(searchValue);
    getCurrentWeather(searchValue);
}


function getCurrentWeather (searchValue) {

    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey;

    fetch(queryUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
        })

}


searchBtn.addEventListener('click', searchValue) 

