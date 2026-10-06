async function getWeather() {

    let city = document.getElementById("cityInput").value;

    let errorMessage = document.getElementById("errorMessage");


    // Check empty input

    if (city == "") {

        errorMessage.innerText =
            "Please enter a city name.";

        errorMessage.style.display = "block";

        return;
    }


    try {

        errorMessage.style.display = "none";


        // Step 1:
        // Find city coordinates

        let locationResponse =
            await fetch(
                "https://geocoding-api.open-meteo.com/v1/search?name="
                + encodeURIComponent(city)
                + "&count=1&language=en&format=json"
            );


        let locationData =
            await locationResponse.json();


        // Check city

        if (
            !locationData.results ||
            locationData.results.length == 0
        ) {

            errorMessage.innerText =
                "City not found. Please enter a valid city.";

            errorMessage.style.display = "block";

            return;
        }


        let location =
            locationData.results[0];


        let latitude =
            location.latitude;

        let longitude =
            location.longitude;


        // Step 2:
        // Get weather data

        let weatherResponse =
            await fetch(
                "https://api.open-meteo.com/v1/forecast"
                + "?latitude=" + latitude
                + "&longitude=" + longitude
                + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
            );


        let weatherData =
            await weatherResponse.json();


        // Get current weather

        let currentWeather =
            weatherData.current;


        // Display city

        document.getElementById("cityName").innerText =
            location.name;


        // Display temperature

        document.getElementById("temperature").innerText =
            currentWeather.temperature_2m + " °C";


        // Display humidity

        document.getElementById("humidity").innerText =
            currentWeather.relative_humidity_2m + " %";


        // Display wind speed

        document.getElementById("windSpeed").innerText =
            currentWeather.wind_speed_10m + " km/h";


        // Get weather condition

        let weatherInfo =
            getWeatherCondition(
                currentWeather.weather_code
            );


        document.getElementById("condition").innerText =
            weatherInfo.condition;


        document.getElementById("weatherIcon").innerText =
            weatherInfo.icon;

    }


    catch (error) {

        errorMessage.innerText =
            "Unable to get weather data. Please try again.";

        errorMessage.style.display = "block";

        console.log(error);
    }
}


/* Convert Weather Code */

function getWeatherCondition(code) {

    if (code == 0) {

        return {
            condition: "Clear Sky",
            icon: "☀️"
        };

    }

    else if (code >= 1 && code <= 3) {

        return {
            condition: "Partly Cloudy",
            icon: "⛅"
        };

    }

    else if (code >= 45 && code <= 48) {

        return {
            condition: "Foggy",
            icon: "🌫️"
        };

    }

    else if (code >= 51 && code <= 67) {

        return {
            condition: "Rainy",
            icon: "🌧️"
        };

    }

    else if (code >= 71 && code <= 77) {

        return {
            condition: "Snowy",
            icon: "❄️"
        };

    }

    else if (code >= 80 && code <= 82) {

        return {
            condition: "Rain Showers",
            icon: "🌦️"
        };

    }

    else if (code >= 95) {

        return {
            condition: "Thunderstorm",
            icon: "⛈️"
        };

    }

    else {

        return {
            condition: "Unknown Weather",
            icon: "🌍"
        };

    }
}