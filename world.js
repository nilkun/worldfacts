class Country {
    constructor(country) {
        this.name = country;
        this.getData();
    }
    getData() {
        const ciaName = getCiaName(this.name);
        let info = data.countries[ciaName].data;
        let govtInfo = info.government;
        this.capital = govtInfo.capital.name ? govtInfo.capital.name : govtInfo.capital.capital;

        // Crop legislative capitals, and extra info
        let idx;
        if((idx = this.capital.indexOf("(")) > -1 ) this.capital = this.capital.substring(0, idx);
        if((idx = this.capital.indexOf(";")) > -1 ) this.capital = this.capital.substring(0, idx);

        this.fullName = govtInfo.country_name.conventional_short_form === "none" ? govtInfo.country_name.conventional_long_form : govtInfo.country_name.conventional_short_form;      
        this.localName = govtInfo.country_name.local_long_form === "none" || !govtInfo.country_name.local_long_form
            ? this.fullName : govtInfo.country_name.local_long_form;  
        this.type = govtInfo.government_type;

        // Crop some info
        if((idx = this.type.indexOf(";")) > -1) this.type = this.type.substring(0, idx);

        this.colors = govtInfo.national_symbol.colors; 
        this.population = data.countries[ciaName].data.people.population.total.toLocaleString();
        this.gdp = data.countries[ciaName].data.economy.gdp.official_exchange_rate.USD;
        this.gdp > 1000000000000 ? 
            this.gdp = (this.gdp/1000000000000).toFixed(1) + " trillion" :
            this.gdp > 1000000000 ? 
                this.gdp = (this.gdp/1000000000).toFixed(1) + " billion" :
                this.gdp = (this.gdp/1000000).toFixed(1) + " million";
        // let milInfo = info.military_and_security;
    }
}

const getCiaName = (originalName) => {

    // Get country name
    let countryName = originalName.toLowerCase();

    // Replace spaces with underscores
    let idx;
    while (idx = countryName.indexOf(' ') > -1)
    {
        idx = countryName.indexOf(' ')
        countryName = countryName.substring(0, idx) + "_" + countryName.substring(idx + 1);
    }

    // Adjust the names to correspond to CIA factbook
    if(!data.countries[countryName]) { 
        if(countryName==="bahamas") countryName = "bahamas_the"
        else if(countryName==="swaziland") countryName = "eswatini"
        else if(countryName==="czech_republic") countryName = "czechia"
        else if(countryName==="north_korea") countryName = "korea_north"
        else if(countryName==="south_korea") countryName = "korea_south"
        else if(countryName==="palestine") countryName = "israel"
        else if(countryName==="congo") countryName = "congo_republic_of_the"
        else if(countryName==="democratic_republic_of_the_congo") countryName = "congo_democratic_republic_of_the"
        else if(countryName==="côte_d'ivoire") countryName = "cote_d'_ivoire"
        else if(countryName==="gambia") countryName = "gambia_the"
        else if(countryName==="myanmar") countryName = "burma"
        else if(countryName==="guinea-bissau") countryName = "guinea_bissau"
        else if(countryName==="timor-leste") countryName = "timor_leste"  
        else if(countryName==="cape_verde") countryName = "cabo_verde"
        else if(countryName==="st._kitts_and_nevis") countryName = "saint_kitts_and_nevis"          
        else if(countryName==="reunion" || countryName==="mayotte" || countryName==="french_guiana" || countryName==="martinique" || countryName==="guadeloupe") countryName = "france"
        else if(countryName==="st._vincent_and_the_grenadines") countryName = "saint_vincent_and_the_grenadines"
        else if(countryName==="são_tomé_and_principe") countryName = "sao_tome_and_principe"
        else if(countryName==="u.s._virgin_islands") countryName = "virgin_islands"
        else if(countryName==="faeroe_islands") countryName = "faroe_islands"
        else if(countryName==="falkland_islands") countryName = "falkland_islands_islas_malvinas"
        else if(countryName==="canary_islands") countryName = "spain"
    }
    return countryName;
}

window.addEventListener("load", () => { 
    svg = document.getElementById("world-svg").contentDocument;
    countries = svg.children[0].children;
    for(let i = 0; i < COUNTRIESLENGTH; i++) {

        // Giving each country a random color for now
        let randomColor1 = 128 + Math.floor(Math.random() * 128);
        let randomColor2 = 0; Math.floor(Math.random() * 256);
        let randomColor3 = 0; Math.floor(Math.random() * 256);
        countries[i].style = `fill:rgb(${randomColor1}, ${randomColor2}, ${randomColor3})`;
        
        countries[i].addEventListener("click", () => {
            const newCountry = new Country(countries[i].getAttribute("dataName"));
            setCountry(newCountry);
        });
    }
});

const setCountry = (country) => {
    // Shows the info box with updated data
    document.querySelector("#countryName").innerHTML = country.fullName;
    document.querySelector("#countryLocalName").innerHTML = country.localName;
    document.querySelector("#countryType").innerHTML = country.type;
    document.querySelector("#capital").innerHTML = country.capital;
    document.querySelector("#population").innerHTML = country.population;
    document.querySelector("#GDP").innerHTML = country.gdp;
    htmlCard.classList.remove("hidden");
}

document.querySelector("#countryX").addEventListener("click", () => {
    htmlCard.classList.toggle("hidden");
})

const COUNTRIESLENGTH = 212; // To circumvent real server error
let countries; // HTMLCollection of SVG paths
let svg; // SVG world map
const htmlCard = document.querySelector(".countryInformation"); // Country cards
let data; // database

fetch("./factbook.json")
.then(res => res.json())
.then((res) => data = res)
.then(() => windowLoaded());

const windowLoaded = () => {
    // this function will run after fetch.
} 

