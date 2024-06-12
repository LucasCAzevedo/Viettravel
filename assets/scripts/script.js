function get_map() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibDMxYXpldmVkbyIsImEiOiJjbHBwenZ0eHoxMXptMm1xZnB1ZzUwOTdtIn0.kJPRVoHsCT7fGC51FRAFKg';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [107.93764278177699, 16.05589550458567], // starting position [lng, lat]
        zoom: 4 // starting zoom
    });
    return map;
}

function get_card_marker(album) {
    return `
    <a class="text-decoration-none text-reset" href="./details.html?id=${album.id}" target="_blank">
        <img src="${album.cover}" class="card-img-top" alt="${album.name}">
        <div class="card-body">
            <h5 class="card-title text-truncate">${album.name}</h5>
        </div>
    </a>`;
}

function get_locations(map) {
    const url = "https://jsonserver.lucasazevedo30.repl.co/album";

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((album) => {
            console.log(album);
            album.forEach((item) => {

                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    get_card_marker(item)
                );

                const marker = new mapboxgl.Marker({ color: "blue" })
                    .setLngLat(item.location_coordinates)
                    .setPopup(popup)
                    .addTo(map);
            });
        });
}

const map = get_map();
get_locations(map);

function renderCard(album) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'col-sm-6 col-md-3 col-lg-3 col-xl-3';

    cardDiv.innerHTML = `
        <div class="card mb-3">
            <img src="${album.cover}" class="card-img-top object-fit-cover" alt="${album.name}" height="150px">
            <div class="card-body">
                <h5 class="card-title">${album.name}</h5>
                <a href="./details.html?id=${album.id}" class="btn btn-primary">Saiba mais</a>
            </div>
        </div>
    `;

    return cardDiv;
}

function renderCards(album) {
    const rowDiv = document.querySelector('.lugares-row');

    album.forEach(album => {
        const card = renderCard(album);
        rowDiv.appendChild(card);
    });
}

fetch('https://jsonserver.lucasazevedo30.repl.co/album')
    .then(response => response.json())
    .then(albumData => {
        renderCards(albumData);
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
    });

// Função para buscar dados da API e adicionar banners ao carousel
function loadCarousel() {
    fetch('https://jsonserver.lucasazevedo30.repl.co/destaques')
        .then(response => response.json())
        .then(data => {
            const carouselIndicators = document.getElementById('carouselIndicators');
            const carouselInner = document.getElementById('carouselInner');

            // Para cada destaque, buscar os detalhes do álbum individualmente
            data.forEach((item, index) => {
                fetch(`https://jsonserver.lucasazevedo30.repl.co/album/${item.albumId}`)
                    .then(response => response.json())
                    .then(albumData => {
                        // Criar o indicador
                        const indicator = document.createElement('button');
                        indicator.setAttribute('type', 'button');
                        indicator.setAttribute('data-bs-target', '#carouselExampleIndicators');
                        indicator.setAttribute('data-bs-slide-to', index.toString());
                        if (index === 0) {
                            indicator.classList.add('active');
                        }
                        carouselIndicators.appendChild(indicator);

                        // Criar o banner com os detalhes do álbum
                        const carouselItem = document.createElement('div');
                        carouselItem.classList.add('carousel-item');
                        if (index === 0) {
                            carouselItem.classList.add('active');
                        }
                        const banner = `
                            <a href="./details.html?id=${albumData.id}">
                                <img src="${albumData.cover}" class="d-block object-fit-cover w-100" alt="${albumData.name}" style="width: 500px; height: 450px;">
                                <div class="carousel-caption d-none d-md-block">
                                    <h5 style="color: white; text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;">${albumData.name}</h5>
                                </div>
                            </a>`;

                        carouselItem.innerHTML = banner;
                        carouselInner.appendChild(carouselItem);
                    });
            });
        });
}

loadCarousel();