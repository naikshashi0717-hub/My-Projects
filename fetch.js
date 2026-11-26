const fetchbtn = document.getElementById("fethbtn");
const cityInput = document.getElementById("city");
const displayweather = document.getElementById("displayweather");

function getWeatherCondition(code) {

    const WeatherCode = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Foggy 🌫️",
        51: "Drizzle 🌧️",
        61: "Slight Rain 🌧️",
        63: "Moderate Rain 🌧️",
        95: "Thunderstorm 🌩️"
    };
    return WeatherCode[code] || "Weather 🌡️";
}

fetchbtn.addEventListener('click', (event) => {
    event.preventDefault();


    const cityName = cityInput.value.trim();

    let citynameIS = "";

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading the link ${response.status}`);
            }
            return response.json();
        }).then(data => {
            if (!data.results || data.results.length === 0) {
                return;
            }

            const result = data.results[0]
            const locationInfo = {
                name: result.name,
                country: result.country || "N/A",
                state: result.admin1 || "",
                latitude: result.latitude,
                longitude: result.longitude
            }

            citynameIS = data.results[0].name;

            const weatherurl = `https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.latitude}&longitude=${locationInfo.longitude}&current=temperature_2m,relative_humidity_2m,temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;  // adding the DAILY will give the weather of days as i put the para tag 

            return fetch(weatherurl)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading the weather details! ${response.status}`);
            }
            return response.json();
        })
        .then(weatherData => {
            const temp = weatherData.current.temperature_2m
            const tempUnits = weatherData.current_units.temperature_2m
            const relativeHumidity = weatherData.current.relative_humidity_2m
            const currentweathercode = weatherData.current.weather_code
            // weather code is undefined beacuse its asking daily 
            const windspeed = weatherData.current.wind_speed_10m

            const daily = weatherData.daily;

            displayweather.innerHTML +=
                `<h2>City Name : ${citynameIS} </h2>     
                        <p>Temparature : ${temp}</p>
                        <p>Temparature Units : ${tempUnits}</p>
                        <p>Humididty : ${relativeHumidity}</p>
                        <p>weather Code : ${currentweathercode}</p>
                        <p>Wind Speed : ${windspeed}</p>`

            let forecastcontainer = document.createElement('div');


            let viewBtn = document.createElement('a');
            viewBtn.className = 'forecast'

            viewBtn.innerHTML = "View 5 days Forecast"
            viewBtn.addEventListener('click', () => {

                for (let i = 0; i < 5; i++) {
                    let forecastcard = document.createElement('div');
                    const date = new Date(daily.time[i]).toLocaleDateString('en-US', { month: 'short', weekday: 'short', day: 'numeric' })
                    const max_temp = weatherData.daily.temperature_2m_max[i];
                    const min_temp = weatherData.daily.temperature_2m_min[i];
                    const weatherCondition = getWeatherCondition(daily.weather_code[i]);

                    forecastcard.innerHTML += `<div>
                    <h3>${date}</h3>
                    <p>Max Temp : ${max_temp}</p>
                    <p>Min Temp : ${min_temp}</p>
                    <p>Condition : ${weatherCondition}</p>
                </div>`

                    forecastcontainer.append(forecastcard);
                }

                forecastcontainer.append(viewBtn)
                viewBtn.style.display = "none"
            });
            displayweather.append(forecastcontainer)
            displayweather.append(viewBtn)

        }).catch(error => {
            console.error("error is :", error)
            displayweather.textContent = `Failed to fetch the ${cityName}'s Weather`
        });

        displayweather.style.display = "";
});


function loadrandomcity() {
    const alpabhet = ["a", "b", "c", "d", "e", "f", "g", "h", "l", "m", "n", "p", "r", "s", "t"];
    const randomletter = alpabhet[Math.floor(Math.random() * alpabhet.length)] + [Math.floor(Math.random() * alpabhet.length)]

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${randomletter}&count=10`)
        .then(response => response.json())
        .then(Citydata => {
            if (!Citydata.results || Citydata.results.length === 0){
                console.log("no cities found",randomletter);
                
                return;
            }
            const randomIndex = Math.floor(Math.random() * Citydata.results.length)
            const city = Citydata.results[randomIndex];

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

            return fetch(weatherUrl).then(response => response.json())
                .then(weatherData => {

                    const temp = weatherData.current.temperature_2m
                    const tempUnits = weatherData.current_units.temperature_2m
                    const relativeHumidity = weatherData.current.relative_humidity_2m
                    const currentweathercode = weatherData.current.weather_code // weather code is undefined beacuse its asking daily 
                    const windspeed = weatherData.current.wind_speed_10m

                    const fiveCity = document.createElement('div');
                    fiveCity.innerHTML += `<div><h2>City Name : ${city.name} </h2>     
                            <p>Temparature : ${temp}</p>
                            <p>Temparature Units : ${tempUnits}</p>
                            <p>Humididty : ${relativeHumidity}</p>
                            <p>weather Code : ${currentweathercode}</p>
                            <p>Wind Speed : ${windspeed}</p><div>`

                    displayweather.append(fiveCity);
                })


        }).catch(error => {
            console.error(error, "Error loading the Cities");
        });
}
for (let i = 0; i < 5; i++) {
    loadrandomcity()
}