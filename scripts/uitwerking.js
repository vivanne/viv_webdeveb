// api documentation: https://whois.fdnd.nl/docs/

const baseURL = 'https://fdnd.directus.app/';
const endpointMe = 'items/person/227';
const endpointSquad = 'items/person/?filter={"squads":{"squad_id":15}}';

const urlMe = baseURL + endpointMe;
const urlSquad = baseURL + endpointSquad;

document.addEventListener("touchstart", function(event) {
    if (event.target.classList.contains("box")) {
        event.target.classList.add("active");
    }
}, true);


getMyImage();

function getMyImage() {
    getData(urlMe).then( data => {  
        // console.log("Full data:", data);  // Log de volledige response om de structuur te controleren

        const myData = data.data;
        // console.log("myData:", myData);  // Log de 'data' om te zien of 'custom' en 'photos' daar in zitten

        if (myData && myData.custom) {
            // Parse de custom string naar een object
            const customData = JSON.parse(myData.custom);
            console.log("Custom data:", customData);

            if (customData.photos) {
                let myPhotos = customData.photos;
                console.log("myPhotos:", myPhotos);  // Log de photos array
            } else {
                console.error("Photos niet gevonden in custom.");
            }
        } else {
            console.error("Custom niet gevonden.");
        }
    }).catch(error => {
        console.error("Error fetching data:", error);  // Log de fout als er iets misgaat
    });
}

let page = 1;
let fetching = false;
const container = document.getElementById('container');
const cols = Array.from(container.getElementsByClassName('col'));
console.log(cols);

const fetchImageData = async () => {
    try {
        fetching = true;
        document.getElementById('loader').style.display = 'block';
        
        // Haal de foto data op (je kunt deze aanroepen binnen de getMyImage functie)
        const data = await getData(urlMe);  // De getData functie roept getMyImage aan, deze kan je aanpassen naar je endpoint
        
        // Haal de 'photos' uit de data
        const myData = data.data;
        const customData = JSON.parse(myData.custom);
        const photos = customData.photos;
        
        fetching = false;
        return photos;
    } catch (error) {
        console.error("Error fetching data:", error);
        fetching = false;
        throw error;
    }
};

fetchImageData().then((photos) => {
    if (photos.length > 0) {
        photos.forEach((photo, index) => {
            createCard(photo, cols[index % cols.length]);
        });
    }
}).catch((error) => {
    console.error("Error initial fetch:", error);
});

const createCard = (photo, col) => {
    const card = document.createElement('div');
    card.classList.add('card');
    
    // Maak de afbeelding aan met de URL uit de JSON data
    const img = document.createElement('img');
    img.src = photo.image_url;  // De image_url komt uit de JSON
    img.alt = photo.title;      // Je kunt de title of description gebruiken als alt tekst
    img.style.width = "100%";
    
    // Foutafhandelaar voor ontbrekende afbeeldingen
    img.onerror = function() {
        this.parentElement.style.display = "none";  // Verberg de kaart als afbeelding niet beschikbaar is
    };
    
    // Verberg de loader als de afbeelding geladen is
    img.onload = function() {
        document.getElementById('loader').style.display = "none";  // Verberg loader na het laden van afbeelding
    };
    
    // Maak de overlay aan
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.innerHTML = `<h3>${photo.title}</h3><p>${photo.description || 'No description available'}</p>`;  // Voeg titel en beschrijving toe aan de overlay

    // Voeg de afbeelding en de overlay toe aan de kaart
    card.appendChild(img);
    card.appendChild(overlay);
    
    col.appendChild(card);  // Voeg de kaart toe aan de kolom
};

// Scroll event handler voor infinite scrolling
const handleScroll = () => {
    if (fetching) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.documentElement.scrollHeight;

    if (bodyHeight - scrollTop - windowHeight < 800) {
        page++;
        fetchImageData().then((photos) => {
            if (photos.length > 0) {
                photos.forEach((photo, index) => {
                    createCard(photo, cols[index % cols.length]);
                });
            }
        }).catch((error) => {
            console.error("Error handling scroll:", error);
        });
    }
};

window.addEventListener('scroll', handleScroll);


async /*9*/ function getData(URL) {
	return ( //8
		fetch(URL) //1
		.then ( //2
			response /*3*/ => response.json() //4
		)
		.then ( //5
			jsonData /*6*/ => {return jsonData} //7
		)
	);
}


// ANIMATIE SCRIPT

// Definieer een array van kleuren voor hover

const hoverColors = [
    'oklch(85% 0.18 15)',   // Lichter Rood
    'oklch(90% 0.25 35)',   // Feller Oranje
    'oklch(85% 0.35 110)',  // Fel Groene Pastel
    'oklch(90% 0.30 45)',   // Feller Geel
    'oklch(85% 0.22 25)',   // Lichter Terracotta (Oranje/Rood)
    'oklch(80% 0.20 65)',   // Feller Oranje Geel
    'oklch(95% 0.12 50)'    // Lichter Geel
];

let animationContainer = document.querySelector('.animation-container');
let count = 1035;
for (let i = 0; i < count; i++) {
    let box = document.createElement('div');
    box.className = 'box';
    animationContainer.appendChild(box); // Voegt de boxen alleen toe aan de .animation-container
}

let box = document.querySelectorAll('.box');
for(let i = 0; i < box.length; i++ ){
    let duration = Math.random() * 2.5;
    let randomColor = hoverColors[Math.floor(Math.random() * 7)];
    box[i].addEventListener('mouseover', (e) => {
        box[i].classList.add('active');
        box[i].style.animationDuration = 1+duration+'s';
        box[i].style.backgroundColor = randomColor;
    });

    console.log(randomColor)
}

// stop animatie button

document.querySelector("#stopAnimatie").addEventListener("click", function()  {
    let element = document.querySelector('.animation-container'); // Haalt het eerste element op
    if (element) {
        element.remove(); // Verwijdert het element
    }
});