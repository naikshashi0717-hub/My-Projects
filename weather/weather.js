const loginA = document.getElementById("loginA");
const registerA = document.getElementById("registerA");

const searchPage = document.getElementById("searchPage");
const searchinput = document.getElementById("searchinput");
const searchBtn = document.getElementById("searchBtn");

const weatherSearchPage = document.getElementById("weatherSearchPage");
const weatherinput = document.getElementById("weatherinput");
const weatherSearchBtn = document.getElementById("weatherSearchBtn");
const logoutBtn = document.getElementById("logoutBtn");


const loginPage = document.getElementById("loginPage");
const username = document.getElementById("username");
const loginemail = document.getElementById("email");
const loginpassword = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

const registerPage = document.getElementById("registerPage");
const regname = document.getElementById("regname");
const regemail = document.getElementById("regemail");
const regpassword = document.getElementById("regpassword");
const registerBtn = document.getElementById("registerBtn");

const userNameDisplay = document.getElementById("usernameheader");

const displayWeatherContainer = document.getElementById("displayWeatherContainer");
const displayCountryInfoContainer = document.getElementById("displayCountryInfoContainer");
const randomcitiesContainer = document.getElementById("randomcitiesContainer");


let isloggedIn = false;
let RegisteredUserArray = [];

const storedLoggedInUser = localStorage.getItem("LoggedInUser");
const storedUserName = localStorage.getItem("LoggedInUserName");

if (storedLoggedInUser) {
    isloggedIn = true;
    if (userNameDisplay && storedUserName) {
        userNameDisplay.textContent = `welcome, ${storedUserName}`;
    }
    weatherSearchPage.style.display = "block";
    loginPage.style.display = "none";
    searchPage.style.display = "none";
    registerPage.style.display = "none";
} else {
    weatherSearchPage.style.display = "none";
    searchPage.style.display = "block";
}

// WEATHER CODE
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

const storedUsers = localStorage.getItem("NewRegisteredUser");
if (storedUsers) {
    RegisteredUserArray = JSON.parse(storedUsers)
}

//REGISTER A TAG 
registerA.addEventListener('click', (event) => {
    event.preventDefault();

    regname.focus();
    searchPage.style.display = "none";
    registerPage.style.display = "block";

});

//LOGIN A TAG
loginA.addEventListener('click', (event) => {
    event.preventDefault();

    username.focus();
    searchPage.style.display = "none";
    loginPage.style.display = "block";
});


//LOGIN USER
registerBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const RegisterName = regname.value;
    const RegisterEmail = regemail.value;
    const RegisterPassword = regpassword.value;
    const RegEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (RegisterName.trim() === "" || RegisterPassword.trim() === "" || RegisterEmail.trim() === "" || !RegEmailPattern.test(RegisterEmail.trim())) {

        regname.value = "";
        regname.focus();

        regpassword.value = "";
        regpassword.focus();

        regemail.value = "";
        regemail.classList.add("error-message");
        regemail.setAttribute("placeholder", "abcd@gmail.com");
        regemail.focus();

        return;
    }


    const existingUserEmail = RegisteredUserArray.find(user => user.email === RegisterEmail.trim())
    if (existingUserEmail) {

        registerPage.style.display = "none"
        loginPage.style.display = "block"
        alert("account already exits!")
        return;
    }
    const newUser = {
        uname: RegisterName.trim(),
        email: RegisterEmail.trim(),
        password: RegisterPassword.trim()
    }

    RegisteredUserArray.push(newUser);
    localStorage.setItem("NewRegisteredUser", JSON.stringify(RegisteredUserArray));



    regemail.value = ""
    regpassword.value = ""
    regname.value = ""

    registerPage.style.display = "none";
    loginPage.style.display = "block";

    alert("Registered Succesfully!, Please login back to access");


});

// LOGIN PAGE

loginBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const UserName = username.value;
    const loginEmail = loginemail.value;
    const loginPassword = loginpassword.value;
    const logingEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    if (UserName.trim() === "" || loginPassword.trim() === "" || loginEmail.trim() === "" || !logingEmailPattern.test(loginEmail.trim())) {

        username.value = "";
        username.focus();

        loginpassword.value = "";
        loginpassword.focus();

        loginemail.value = "";
        loginemail.classList.add("error-message");
        loginemail.setAttribute("placeholder", "abcd@gmail.com");
        loginemail.focus();

        return;
    }


    const existingUser = RegisteredUserArray.find(user => user.email === loginEmail.trim());
    if (!existingUser) {

        loginemail.classList.add("Error-msg")
        loginemail.setAttribute("placeholder", "Register the email!");

        loginPage.style.display = "none"
        registerPage.style.display = "block"

        loginemail.focus();
        alert("register the email!")
        return;

    }

    if (existingUser.password !== loginPassword.trim()) {

        loginpassword.classList.add("Error-msg")
        loginpassword.setAttribute("placeholder", "Wrong password");

        loginPage.style.display = "block";
        registerPage.style.display = "none";

        loginpassword.focus();
        alert("Password worng!")

        return;
    }

    const nameToDisplay = existingUser.uname || UserName.trim();

    localStorage.setItem("LoggedInUser", loginEmail.trim());
    localStorage.setItem("LoggedInUserName", nameToDisplay);

    if (userNameDisplay) {
        userNameDisplay.textContent = `${nameToDisplay}`;
    }

    username.value = ""
    loginemail.value = ""
    loginpassword.value = ""
    weatherinput.value = ""

    isloggedIn = true;

    loginPage.style.display = "none";
    weatherSearchPage.style.display = "block";

    weatherinput.focus();


    alert(`welcome ${loginEmail}`);
});

// LOGOUT BUTTON

logoutBtn.addEventListener('click', () => {
    if (userNameDisplay) {
        userNameDisplay.textContent = "";
    }

    alert("logging out!");

    searchPage.style.display = "block";
    weatherSearchPage.style.display = "none";

    username.value = ""
    loginemail.value = ""
    loginpassword.value = ""

    regname.value = ""
    regemail.value = ""
    regpassword.value = ""

    if (displayWeatherContainer) {
        displayWeatherContainer.innerHTML = ""
    }

    searchinput.focus();

    localStorage.removeItem("LoggedInUser")
    localStorage.removeItem("LoggedInUserName")
});

// SEARCH CITY DETAILS API

weatherSearchBtn.addEventListener('click', () => {

    const weatherInput = weatherinput.value.trim();
    if (!weatherInput) return;

    let citynameIS = "";

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(weatherInput)}`)
        .then(response => {
            if (!response.ok)
                throw new Error(`error loading the link,${response.status}`);
            return response.json();
        }).then(data => {

            if (!data.results || data.results.length === 0) {
                throw new Error("city no found");
            }

            const result = data.results[0]
            const locationInfo = {
                cityname: result.name,
                country: result.country || "N/A",
                state: result.admin1 || "N/A",
                latitude: result.latitude,
                longitude: result.longitude
            };
            citynameIS = result.name;

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.latitude}&longitude=${locationInfo.longitude}&current=temperature_2m,relative_humidity_2m,temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;


            return fetch(weatherUrl)
                .then(response => {
                    if (!response.ok)
                        throw new Error(`Error loading the weather ${response.status}`);
                    console.log("respnse we URl", response);
                    return response.json();
                })
                .then(weatherData => ({ weatherData, locationInfo }))
        })
        .then(({ weatherData, locationInfo }) => {
            if (!weatherData) return;

            const temp = weatherData.current.temperature_2m;
            const humidity = weatherData.current.relative_humidity_2m;
            const weatherCode = weatherData.current.weather_code;
            const windspeed = weatherData.current.wind_speed_10m;
            const daily = weatherData.daily;

            console.log("weather data", weatherData);

            displayWeatherContainer.innerHTML = "";

            let searchCard = document.createElement('div');
            searchCard.innerHTML = `
                <h2>City : ${locationInfo.cityname} (${locationInfo.country})</h2>
                <p>Temp : ${temp}°C</p>
                <p>Humidity : ${humidity}</p>
                <p>Weather Condition : ${getWeatherCondition(weatherCode)}</p>
                <p>Windspeed : ${windspeed}</p>`;


            let forecastcontainer = document.createElement('div');
            let viewBtn = document.createElement('a');
            let backBtn = document.createElement('a');
            backBtn.innerHTML = "Back"
            backBtn.style.display = "none"
            viewBtn.innerHTML = "view 7 day forecast";

            viewBtn.addEventListener('click', () => {

                forecastcontainer.innerHTML = "";
                for (let i = 0; i < 7; i++) {
                    const forecastcard = document.createElement('div');
                    const date = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: "short", month: 'short', day: '2-digit', year: 'numeric' });
                    const max_temp = weatherData.daily.temperature_2m_max[i];
                    const min_temp = weatherData.daily.temperature_2m_min[i];
                    const weatherCondition = getWeatherCondition(daily.weather_code[i]);

                    forecastcard.innerHTML = `
                        <h2>City : ${citynameIS}</h2>
                        <p>Date :${date} </p>
                        <p>Max Temp :${max_temp}°C </p>
                        <p>Min Temp :${min_temp}°C</p>
                        <p>Weather Condition :${weatherCondition} </p>
                        `
                    forecastcontainer.append(forecastcard);
                }

                viewBtn.style.display = "none";
                backBtn.style.display = "block"

            })
            backBtn.addEventListener('click', () => {
                forecastcontainer.innerHTML = "";
                backBtn.style.display = "none"
                viewBtn.style.display = "block"
            });
            searchCard.append(forecastcontainer);
            searchCard.append(viewBtn);
            searchCard.append(backBtn);
            displayWeatherContainer.prepend(searchCard);
        })
        .catch(error => {
            displayWeatherContainer.textContent = `Failed to Fetch "${weatherInput || `entered city`}"`
            return error;
        })
});

// LOADING RANDOM CITIES

async function loadrandomcity() {
    try {
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

        const randomcities = indianCitiesList[Math.floor(Math.random() * indianCitiesList.length)];

        const cityLoadUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(randomcities)}&count=10 `

        const cityLoadResp = await fetch(cityLoadUrl);

        if (!cityLoadResp.ok) {
            throw new Error(`Error loading the cities ${cityLoadResp.status}`);
        }

        const cityloadData = await cityLoadResp.json();

        if (!cityloadData.results || cityloadData.results.length === 0) {
            displayWeatherContainer.innerHTML = `No Cities found ${randomcities}`;
            return;
        }

        const indiancities = cityloadData.results.filter(city => city.country === "India")

        if (indiancities.length === 0) {
            displayWeatherContainer.innerHTML = `Error`
            return;
        }

        const randomIndex = Math.floor(Math.random() * indiancities.length)
        const city = indiancities[randomIndex]

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

        const weatherResp = await fetch(weatherUrl);

        if (!weatherResp.ok) {
            console.log("Error response in random city async function", weatherResp.status);
        }

        const weatherData = await weatherResp.json();

        if (weatherData.length === 0) {
            console.log("Error resposnse in random weather data", weatherData);
        }

        const temp = weatherData.current.temperature_2m;
        const tempUnits = weatherData.current_units.temperature_2m;
        const relativeHumidity = weatherData.current.relative_humidity_2m;
        const currentweathercode = weatherData.current.weather_code;
        const windspeed = weatherData.current.wind_speed_10m;

        const daily = weatherData.daily;

        const fiveCityrandom = document.createElement('div');
        fiveCityrandom.innerHTML = `
        <h2>City Name : ${city.name} (${city.country || 'N/A'})</h2>    
        <p>Temperature : ${temp} ${tempUnits}</p>
        <p>Humidity : ${relativeHumidity}%</p>
        <p>Weather Code : ${getWeatherCondition(currentweathercode)}</p>
        <p>Wind Speed : ${windspeed}</p>`;

        let forecastContainer = document.createElement('div');
        let viewBtn = document.createElement('a')
        viewBtn.innerHTML = "View 5 days forecast"
        let backBtn = document.createElement('a')
        backBtn.innerHTML = "Back"
        backBtn.style.display = "none"

        viewBtn.addEventListener('click', () => {
            for (let i = 0; i < 5; i++) {
                let forecastcard = document.createElement('div');
                const temp = weatherData.daily.temperature_2m_max[i]
                const max_temp = weatherData.daily.temperature_2m_max[i]
                const min_temp = weatherData.daily.temperature_2m_min[i]
                const weatherCondition = getWeatherCondition(daily.weather_code[i])
                const date = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })


                forecastcard.innerHTML = `
                <h2>City : ${city.name}</h2>
                <p>Date : ${date}</p>
                <p>Temprature : ${temp}</p>
                <p>Maximum : ${max_temp}</p>
                <p>Minimum : ${min_temp}</p>
                <p>Weather Condition : ${weatherCondition}</p>
                `
                forecastContainer.append(forecastcard);
            }
            viewBtn.style.display = "none"
            backBtn.style.display = "block"
        });
        backBtn.addEventListener('click', () => {
            forecastContainer.innerHTML = "";
            viewBtn.style.display = "block";
            backBtn.style.display = "none";
        });
        fiveCityrandom.append(viewBtn)
        fiveCityrandom.append(forecastContainer)
        fiveCityrandom.append(backBtn)
        randomcitiesContainer.append(fiveCityrandom)
    } catch (error) {
        console.log("Error in laoiding random city : ", error);

    }

}
for (let i = 0; i < 5; i++) {
    loadrandomcity();
}



// SEARCH BUTTON FRONT PAGE

const API_KEY = "5aba13c1c1806058bdffb847a8a36d063acb31ebbb18860cffab1b001b01ec15";

searchBtn.addEventListener('click', () => {

    async function getinfo() {
        const SearchInput = searchinput.value.trim().toUpperCase();

        if (!SearchInput) {
            searchinput.classList.add("error-msg");
            searchinput.setAttribute("placeholder", "Enter Country ISO2 code!")
            searchinput.focus();
            return
        }

        try {
            const listDataUrl = `https://api.countrystatecity.in/v1/countries/`

            const listDataUrlResp = await fetch(listDataUrl, {
                method: "GET",
                headers: { "X-CSCAPI-KEY": API_KEY }
            })

            if (!listDataUrlResp.ok) {
                throw new Error(`Error fetcing response! ${listDataUrlResp.status}`);
            }

            const listData = await listDataUrlResp.json();

            const matchData = listData.find((c) => c.iso2?.toUpperCase() === SearchInput ||
                c.name?.toUpperCase() === SearchInput);

            if (!matchData) {
                throw new Error(`Error loaidng the data ${matchData}`);

            }

            const countryUrl = `https://api.countrystatecity.in/v1/countries/${matchData.iso2}`;

            const countryResp = await fetch(countryUrl, {
                method: "GET",
                headers: { "X-CSCAPI-KEY": API_KEY }
            });

            if (!countryResp.ok) {
                throw new Error(`Error loading the country details ${countryResp.status}`);
            }

            const countryData = await countryResp.json();

            const fields = [
                ["Country", countryData.name],
                ["ISO2", countryData.iso2],
                ["Currency", countryData.currency],
                ["Capital", countryData.capital],
                ["Region", countryData.region]
            ]

            let displayCountryInfo = document.createElement('div');
            for (const [label, value] of fields) {
                const para = document.createElement('p')
                para.innerHTML = `${label} : ${value ?? "N/A"}`
                displayCountryInfo.append(para);
            }
            displayCountryInfoContainer.replaceChildren(displayCountryInfo)

        } catch (error) {
            console.log("Error loding link!");
            displayCountryInfoContainer.textContent = `Failed to fetch weather and info ${SearchInput}`
        }
    }
    getinfo()
});
