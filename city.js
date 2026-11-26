const cityContainer = document.getElementById("citycontainer");
const searchInput = document.getElementById("searchinput");
const SearchBtn = document.getElementById("searchBtn");
const displaycitycontainer = document.getElementById("displaycitycontainer");

const API_KEY = "5aba13c1c1806058bdffb847a8a36d063acb31ebbb18860cffab1b001b01ec15";

SearchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    async function getinfo() {
        const SearchInput = searchInput.value.trim().toUpperCase();

        if (!SearchInput) {
            searchInput.classList.add("error-message");
            searchInput.setAttribute("placeholder", "Enter country iso2 code")
            searchInput.focus();
            return;
        }

        try {
            const datalistUrl = `https://api.countrystatecity.in/v1/countries/`;

            const dataUrlResp = await fetch(datalistUrl, {
                method: "GET",
                headers: { "X-CSCAPI-KEY": API_KEY }
            })

            const datalistUrldata = await dataUrlResp.json()

            if (!dataUrlResp.ok) {
                throw new Error(`Error loading ${dataUrlResp.status}`)
            }

            const matchData = datalistUrldata.find((c) => c.iso2?.toUpperCase() === SearchInput || 
            c.name?.toUpperCase() === SearchInput);

            if (!matchData) {
                throw new Error(`Error : ${SearchInput}`);
            }

            const countryUrl = `https://api.countrystatecity.in/v1/countries/${encodeURIComponent(matchData.iso2)}`;

            const countryResp = await fetch(countryUrl, {
                method: "GET",
                headers: { "X-CSCAPI-KEY": API_KEY }
            });

            if (!countryResp.ok) {
                throw new Error(`Error loading the data ${countryResp.status}`);
            }

            const countryData = await countryResp.json();

            const fields = [
                ["Country", countryData.name],
                ["ISO2", countryData.iso2],
                ["Currency", countryData.currency],
                ["Capital", countryData.capital],
                ["Region", countryData.region]
            ]

            let displaysubcontainer = document.createElement('div');
            for (const [label, value] of fields) {
                const para = document.createElement('p');
                para.innerHTML = `${label} : ${value ?? "N/A"} `
                displaysubcontainer.append(para)
            }

            displaycitycontainer.replaceChildren(displaysubcontainer);
        }
        catch (error) {
            console.log(error);
            displaycitycontainer.textContent = (`Error: ${error.message}`);
        }

    }
    getinfo();

});
