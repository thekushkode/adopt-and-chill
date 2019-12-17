// global variables

let STRAINNAME;
let STRAINEFFECTS;
let LOCATION="30307";
let DOGCALLS;
let BREEDARRAY;
let cardDeck = document.querySelector(".card-z");


//API URL creation functions.
function strainRaceURLGen(race){
    return `https://strainapi.evanbusse.com/${strainAPIKey}/strains/search/race/${race}`;
}

function strainURLGen(strainID, searchy){
    return `https://strainapi.evanbusse.com/${strainAPIKey}/strains/data/${searchy}/${strainID}`;
}

function randomDogURLGenerator(dogBreed){
    return `https://api.petfinder.com/v2/animals/?type=dog&breed=${dogBreed}&location=${LOCATION}&limit=100&status=adoptable`;
}

//Builds DOM elements for zipcode form and reset button, loads them into an array, and returns that array.
function formBuilder(){
    let domArr = [];

    let form = document.createElement("form");
    form.action="";
    form.className="js-form-container";

    let input1 = document.createElement("input");
    input1.className = "js-search-input";
    input1.type = "text";
    input1.placeholder = "Enter your Zip Code";

    let input2 = document.createElement("input");
    input2.className = "js-search-btn";
    input2.type = "submit";

    let reset = document.createElement("button");
    reset.className = "js-reset-btn";
    reset.textContent = "reset";
    reset.addEventListener("click", resetPage);

    form.appendChild(input1);
    form.appendChild(input2);
    form.addEventListener("submit", e =>{
        e.preventDefault(); //keeps the page from reloading on click
        LOCATION = e.target.elements[0].value; //sets global LOCATION variable to value entered into field.
        if(LOCATION.length != 5){ //checks to see if valid zipcode length, and if not, resets LOCATION to default zipcode.
            LOCATION = "30307";
            clearBarDeck();
        }
    });

    domArr.push(form);
    domArr.push(reset);
    return domArr;
}

function lookInside(o){  //function to see what is being passed thru in a .then chain
    console.log(o);
    return o;
}

function clearCardDeck(passThru){  //empties the primary container, so that it can be refilled.
    cardDeck.textContent = "";
    return passThru;
}

function clearBarDeck(){
    let textToReset = document.querySelector(".js-search-input");
    console.log(textToReset);
    textToReset.value = "";
    LOCATION = "30307";
}

function setBarDeck(barArr){
    let barDeck = document.querySelector(".zipcode-button");
    barArr.map(obj => barDeck.appendChild(obj));
}

function appendCardToDeck(card){
    cardDeck.appendChild(card);
}

function appendFinalCards(){
    CARDARR.map(card => cardDeck.appendChild(card));
}

function createRaceDOMs(){
    let raceDomArr = [];
    let raceArr = ["Indica", "Sativa", "Hybrid"];
    for (let race of raceArr) {
        let card = document.createElement('div');
        card.className = "js-card";
        card.race = race;
    
        let img = document.createElement('img');
        img.className = "js-card-img-top";
        img.src = `images/${race.toLowerCase()}-dog.png`;
        img.alt = `${race} dog`;
        
        let h5 = document.createElement('h5');
        h5.textContent = race;
        
        card.appendChild(img);
        card.appendChild(h5);
        card.addEventListener('click', raceClick);
        
        raceDomArr.push(card);
    }
    return raceDomArr;
}

function raceClick(event){
    // to add begginer, intermediate, and expert modes, CHANGE THIS FUNCTION!!!!
    // 3 if statements for each different difficulty.
    let domArr=[];
    fetch(strainRaceURLGen(event.currentTarget.race))
        .then(x => x.json())
        .then(selectRandomStrain)
        .then(getStrainInfo)
        .then(clearCardDeck)
        .then(createSingleStrainDOM)
        .then(buildGoodDogArr)
        .then(createNewDog)
}

function selectRandomStrain(strainArr){
    let rando = Math.floor(Math.random() * strainArr.length);
    STRAINNAME = strainArr[rando].name;
    return strainArr[rando].id;
}

async function getStrainInfo(strainID){
    let URLArr = [strainURLGen(strainID,"desc"),strainURLGen(strainID,"effects"),strainURLGen(strainID,"flavors")]
    let values = await Promise.all(URLArr.map(url => fetch(url).then(r => r.json())));
    return values;
}

function createSingleStrainDOM(infoArr){
    let card = document.createElement('div');
    card.className = "js-card-title";
    
    let h5 = document.createElement("h5");
    h5.className = "js-card-title";
    h5.textContent = "Your new Strain!";

    let img = document.createElement("img");
    img.src = "images/noun_Marijuana_2183514.png";
    img.className = "js-card-img-top";
    img.alt = "weed leaf";

    let p1 = document.createElement('p');
    p1.className = "js-card-text";
    p1.textContent = STRAINNAME;
    
    let p2 = document.createElement('p');
    p2.className = "js-card-text";
    p2.textContent = infoArr[0].desc;
    
    let p3 = document.createElement('p');
    p3.className = "js-card-text";
    STRAINEFFECTS = infoArr[1];
    p3.textContent = effectText(STRAINEFFECTS);
    
    let p4 = document.createElement('p');
    p4.className = "js-card-text";
    p4.textContent = flavorText(infoArr[2]);
    
    card.appendChild(h5);
    card.appendChild(img);
    card.appendChild(p1);
    card.appendChild(p2);
    card.appendChild(p3);
    card.appendChild(p4);
    cardDeck.appendChild(card);
}

function effectText(effectObj){
    let posiEffects = "";
    let negEffects = "";
    let medEffects ="";
    for (let effect of effectObj.positive){
        posiEffects = posiEffects + effect + " ";
    }
    for (let effect of effectObj.negative){
        negEffects = negEffects + effect + " ";
    }
    for (let effect of effectObj.medical){
        medEffects = medEffects + effect + " ";
    }
    let effectString = `Effects \n Positive : \n ${posiEffects} \n Negative: \n ${negEffects} \n Medical:\n ${medEffects}`;

    return effectString;
}

function flavorText(flavorObj){
    flavors = "";
    for (let flavor of flavorObj){
        flavors = flavors + flavor + " ";
    }
    let flavorString = `Flavor notes: ${flavors}`;
    return flavorString;
}

function getStrain(strainID){
    fetch(strainURLGen(strainID))
        .then(p => p.json())
        .then(lookInside)
        .then(strainToBreedConverter)
}


function buildGoodDogArr(strainEffects = STRAINEFFECTS){
    let effArr = [];
    let newDogArr = [];
    let dogHisto = {};
    let dogArr = Object.keys(dogChars);
    for (let effCat of Object.keys(strainEffects)){
        for (let eff of strainEffects[effCat]){
            effArr.push(eff);
        }
    }

    if(effArr.length == 0){
        return dogArr;
    }

    for (let dog of dogArr){
        console.log(dog);
        for (let eff of effArr){
            console.log(dogChars[dog]);
            if(dogChars[dog].includes(eff)){
                if(dog in Object.keys(dogHisto)){
                    dogHisto[dog] += 1;
                } else{
                    dogHisto[dog] = 1;
                }
            }
        }
    }
    console.log(dogHisto);
    newDogArr = Object.keys(dogHisto);
    BREEDARRAY=newDogArr;
    return newDogArr;
}

function strainToBreedConverter(strainEffects = STRAINEFFECTS){
    let dogBreed = BREEDARRAY[Math.floor(Math.random() * BREEDARRAY.length)];

    return dogBreed;
}

function createNewDog(){
    console.log("createNewDog");
        requestData(randomDogURLGenerator(strainToBreedConverter()))
            .then(r =>{
                if(DOGCALLS > 3){
                    buildNoDogDOM();
                } else if(!r.animals){
                    buildNoDogDOM();
                } else if(r.animals.length == 0){
                    DOGCALLS +=1;
                    createNewDog();
                } else{
                    buildDogDOM(selectRandDog(r));
                }
            })
}    

function buildNoDogDOM(){
    DOGCALLS =0;
    let card = document.createElement('div');
    card.className = "js-card-title";
    
    let h5 = document.createElement("h5");
    h5.className = "js-card-title";
    h5.textContent = "We are so sorry but we can't find the right dog for you...";

    let img = document.createElement("img");
    img.src = "images/weed-eyes.png";
    img.className = "js-card-img-top";
    img.alt = "weed dog.";

    card.appendChild(h5);
    card.appendChild(img);
    cardDeck.appendChild(card);
}


function selectRandDog(dogArr){
    console.log('selectRandDog');
    console.log(dogArr);
    let dog = dogArr.animals[Math.floor(Math.random() * dogArr.animals.length)];
    console.log(dog);
    return dog;
}

function buildDogDOM(dogCard){
    DOGCALLS =0;
    let card = document.createElement('div');
    card.className = "js-card-title";
    
    let h5 = document.createElement("h5");
    h5.className = "js-card-title";
    h5.textContent = "Your new Best Friend!";

    let img = document.createElement("img");
    if(!dogCard.photos[0]){
        img.src = "images/weed-eyes.png";
    }else{
        img.src = dogCard.photos[0].full;
    }
    
    img.className = "js-card-img-top";
    img.alt = "your new best friend!";

    let p1 = document.createElement('p');
    p1.className = "js-card-text";
    p1.textContent = dogCard.name;
    console.log(p1);

    let p2 = document.createElement('p');
    p2.className = "js-card-text";
    p2.textContent = dogCard.description;
    console.log(p2);

    let a = document.createElement('a');
    a.className = "js-adopt-button";
    a.href = dogCard.url;
    a.textContent = `adopt me!!`;
    
    card.appendChild(h5);
    card.appendChild(img);
    card.appendChild(p1);
    card.appendChild(p2);
    card.appendChild(a);
    cardDeck.appendChild(card);
}

function main(){
    DOGCALLS = 0;
    setBarDeck(formBarArr);
    raceDomArr.map(appendCardToDeck);
}

function resetPage(){
    clearCardDeck();
    clearBarDeck();
    main();
}

getToken();
const formBarArr = formBuilder();
const raceDomArr = createRaceDOMs();

window.addEventListener('DOMContentLoaded', main);