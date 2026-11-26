const fetchbtn = document.getElementById("fethbtn");
const cityInput = document.getElementById("city");
const displayweather = document.getElementById("displayweather");


// Global Weather Condition helper
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

// 1. Manual Search Event Listener
fetchbtn.addEventListener('click', (event) => {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    let citynameIS = "";

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}`)
        .then(response => {
            if (!response.ok) throw new Error(`Error loading the link ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!data.results || data.results.length === 0) return;

            const result = data.results[0];
            const locationInfo = {
                name: result.name,
                country: result.country || "N/A",
                state: result.admin1 || "",
                latitude: result.latitude,
                longitude: result.longitude
            };

            citynameIS = result.name;

            const weatherurl = `https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.latitude}&longitude=${locationInfo.longitude}&current=temperature_2m,relative_humidity_2m,temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

            return fetch(weatherurl);
        })
        .then(response => {
            if (!response.ok) throw new Error(`Error loading the weather details! ${response.status}`);
            return response.json();
        })
        .then(weatherData => {
            if (!weatherData) return;

            const temp = weatherData.current.temperature_2m;
            const tempUnits = weatherData.current_units.temperature_2m;
            const relativeHumidity = weatherData.current.relative_humidity_2m;
            const currentweathercode = weatherData.current.weather_code;
            const windspeed = weatherData.current.wind_speed_10m;
            const daily = weatherData.daily;

            let searchCard = document.createElement('div')
            searchCard.innerHTML += `
                    <h2>City Name : ${citynameIS} </h2>    
                    <p>Temperature : ${temp} ${tempUnits}</p>
                    <p>Humidity : ${relativeHumidity}%</p>
                    <p>Weather Code : ${getWeatherCondition(currentweathercode)}</p>
                    <p>Wind Speed : ${windspeed}</p>
                `;

            let forecastcontainer = document.createElement('div');
            let viewBtn = document.createElement('a');
            viewBtn.className = 'forecast';
            viewBtn.innerHTML = "View 5 days Forecast";

            viewBtn.addEventListener('click', () => {
                for (let i = 0; i < 5; i++) {
                    let forecastcard = document.createElement('div');
                    const date = new Date(daily.time[i]).toLocaleDateString('en-US', { month: 'short', weekday: 'short', day: 'numeric' });
                    const max_temp = weatherData.daily.temperature_2m_max[i];
                    const min_temp = weatherData.daily.temperature_2m_min[i];
                    const weatherCondition = getWeatherCondition(daily.weather_code[i]);

                    forecastcard.innerHTML += `<div>
                            <h3>${date}</h3>
                            <p>Max Temp : ${max_temp}</p>
                            <p>Min Temp : ${min_temp}</p>
                            <p>Condition : ${weatherCondition}</p>
                        </div>`;

                    forecastcontainer.append(forecastcard);
                }

                forecastcontainer.append(viewBtn);
                viewBtn.style.display = "none";
            });

            searchCard.append(forecastcontainer);
            searchCard.append(viewBtn);
            displayweather.prepend(searchCard);


        })
        .catch(error => {
            console.error("error is :", error);
            displayweather.textContent = `Failed to fetch the ${cityName}'s Weather`;
        });
});


// 2. Random City Loader Function
function loadrandomcity() {

    const indianCitiesList = [
        "Bengaluru", "Mumbai", "Delhi", "Chennai", "Kolkata",
        "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
        "Surat", "Kanpur", "Nagpur", "Indore", "Thane",
        "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad",
        "Ludhiana", "Agra", "Nashik", "Ranchi", "Faridabad",
        "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad",
        "Dhanbad", "Amritsar", "Allahabad", "Howrah", "Gwalior",
        "Jabalpur", "Coimbatore", "Vijayawada", "Jodhpur", "Madurai",
        "Chandigarh", "Mysuru", "Gurugram", "Noida", "Mangaluru",
        "Hubballi", "Panaji", "Shimla", "Dehradun", "Kochi"
    ];
    const randomletter = indianCitiesList[Math.floor(Math.random() * indianCitiesList.length)];

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(randomletter)}&count=10`)
        .then(response => {
            if (!response.ok)
                throw new Error("Error loading cities", response.status);
            return response.json()
        })
        .then(Citydata => {
            if (!Citydata.results || Citydata.results.length === 0) {
                console.log("no cities found", randomletter);
                return;
            }

            const indiancities = Citydata.results.filter(city => city.country === "India")
            if (indiancities.length === 0)
                return;
            const randomIndex = Math.floor(Math.random() * indiancities.length);
            const city = indiancities[randomIndex];

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

            return fetch(weatherUrl)
                .then(response => {
                    if (!response.ok)
                        throw new Error("Error loading link", response.status);
                    return response.json()
                })

                .then(weatherData => {

                    const temp = weatherData.current.temperature_2m;
                    const tempUnits = weatherData.current_units.temperature_2m;
                    const relativeHumidity = weatherData.current.relative_humidity_2m;
                    const currentweathercode = weatherData.current.weather_code;
                    const windspeed = weatherData.current.wind_speed_10m;

                    const fiveCity = document.createElement('div');
                    fiveCity.style.cssText = "border: 1px solid #ccc; margin: 10px; padding: 10px; border-radius: 8px;";

                    const daily = weatherData.daily;

                    fiveCity.innerHTML = `
                    <h2>City Name : ${city.name} (${city.country || 'N/A'})</h2>    
                    <p>Temperature : ${temp} ${tempUnits}</p>
                    <p>Humidity : ${relativeHumidity}%</p>
                    <p>Weather Code : ${getWeatherCondition(currentweathercode)}</p>
                    <p>Wind Speed : ${windspeed}</p>
                    `;


                    let forecastContainer1 = document.createElement('div');
                    let ViewBtn1 = document.createElement('a');
                    ViewBtn1.classList.add = "forecast";

                    let backBtn = document.createElement('a');
                    backBtn.innerHTML = "Back to Current weather";
                    backBtn.className = "forecast"
                    backBtn.style.display = "none"

                    ViewBtn1.innerHTML = `5 days forecast of ${city.name}`
                    ViewBtn1.addEventListener('click', () => {
                        forecastContainer1.innerHTML = "";

                        for (let i = 0; i < 5; i++) {
                            let forecastcard1 = document.createElement('div');
                            const date = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            const max_temp = weatherData.daily.temperature_2m_max[i];
                            const min_temp = weatherData.daily.temperature_2m_min[i];
                            console.log("api response", weatherData);
                            const weatherCondition = getWeatherCondition(daily.weather_code[i]);


                            forecastcard1.innerHTML = `<div>
                            <h2>${city.name}</h2>
                            <p>${date}</p>
                            <p>${max_temp}</p>
                            <p>${min_temp}</p>
                            <p>${weatherCondition}</p>
                            </div>`

                            forecastContainer1.append(forecastcard1);
                        }
                        ViewBtn1.style.display = "none"
                        backBtn.style.display = "block"
                    });

                    backBtn.addEventListener('click', () => {
                        forecastContainer1.innerHTML = "";
                        ViewBtn1.style.display = "block";
                        backBtn.style.display = "none";

                    })

                    fiveCity.append(ViewBtn1)
                    fiveCity.append(backBtn)
                    fiveCity.append(forecastContainer1)
                    displayweather.append(fiveCity);
                })
        })
        .catch(error => {
            console.error("Error loading random cities:", error);
        });
}

// Run 5 times on startup
for (let i = 0; i < 5; i++) {
    loadrandomcity();
}
