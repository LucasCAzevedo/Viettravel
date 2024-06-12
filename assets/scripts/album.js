const urlBase = "https://jsonserver.lucasazevedo30.repl.co";

async function renderDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('id');

    const album = await fetchAlbumDetails(albumId);
    updateAlbumDetails(album);
}

async function fetchAlbumDetails(albumId) {
    try {
        const response = await fetch(`${urlBase}/album/${albumId}?_embed=photos`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar os dados: ', error);
    }
}

// Função para atualizar o conteúdo HTML com os detalhes
function updateAlbumDetails(album) {
    if (album) {
        document.getElementById('albumName').textContent = album.name;
        document.getElementById('albumImage').src = album.cover;
        document.getElementById('albumDescription').textContent = album.description;
        document.getElementById('albumLat').textContent = `LAT: ${album.location_coordinates[0]}`;
        document.getElementById('albumLong').textContent = `LONG: ${album.location_coordinates[1]}`;
        document.getElementById('albumDate').textContent = album.date;

        if (album.photos && album.photos.length > 0) {
            renderPhotos(album.photos);
        }
    } else {
        alert('Foto não encontrada');
    }
}

// Função para buscar as fotos dos detalhes
async function renderPhotos(photos) {
    const divPhotos = document.getElementById('albumPhotos');
    photos.forEach(photo => {
        const htmlPhoto = `
        <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3">
                <div class="card mb-3">
                    <img src="${photo.url}" alt="${photo.description}" class="card-img-top object-fit-cover" height="150px" width="200">
                    <div class="card-body">
                        <p class="card-text">${photo.description}</p>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#modal-fotos">
                            Veja mais
                        </button>
                    </div>
                </div>
            </div>`;
        divPhotos.innerHTML += htmlPhoto;
    });
}

let idDestaque = null;

async function initiateCheckbox() {
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('id');
    try {
        const response = await fetch(`${urlBase}/destaques?albumId=${albumId}`);
        const data = await response.json();
        setHighlight(data, albumId);
    } catch (error) {
        console.error('Álbum não é destaque', error);
    }

    const checkbox = document.getElementById('destaques');
    checkbox.checked = !!idDestaque || checkbox.checked;

    checkbox.addEventListener('change', function(event) {
        if (event.target.checked) {
            addOrRemoveHighlight('add', albumId);
            console.log('Checkbox está marcado!');
        } else {
            addOrRemoveHighlight('remove', albumId);
            console.log('Checkbox não está marcado!');
        }
    });
}

function setHighlight(destaques, albumId) {
    const checkbox = document.getElementById('destaques');
    console.log('Array de destaques:', destaques);

    if (destaques && destaques.some(item => item.albumId === parseInt(albumId))) {
        checkbox.checked = true;
        idDestaque = destaques.find(item => item.albumId === parseInt(albumId)).id;
        console.log('ID do destaque:', idDestaque);
    }
}

function addOrRemoveHighlight(action, albumId) {
    const url = `${urlBase}/destaques`;
    const method = action === 'add' ? 'POST' : 'DELETE';
    const data = action === 'add' ? { albumId: parseInt(albumId) } : {};

    const request = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: method === 'POST' ? JSON.stringify(data) : null
    };

    fetch(url + (action === 'remove' ? `/${idDestaque}` : ''), request)
        .then(response => {
            console.log(response);
            const actionText = action === 'add' ? 'adicionado' : 'removido';
            alert(`Álbum ${actionText} dos destaques`);
            if (action === 'remove') {
                idDestaque = null;
            }
            return true;
        });
}

function loadCarousel() {

    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('id');

    fetch(`https://jsonserver.lucasazevedo30.repl.co/photos?albumId=${albumId}`)
        .then(response => response.json())
        .then(data => {
            const carouselIndicators = document.getElementById('carouselIndicators');
            const carouselInner = document.getElementById('carouselInner');

            // Para cada item, criar um indicador e um banner no carousel
            data.forEach((item, index) => {
                // Criar o indicador
                const indicator = document.createElement('button');
                indicator.setAttribute('type', 'button');
                indicator.setAttribute('data-bs-target', '#carouselExampleIndicators');
                indicator.setAttribute('data-bs-slide-to', index.toString());
                if (index === 0) {
                    indicator.classList.add('active');
                }
                carouselIndicators.appendChild(indicator);

                // Criar o banner
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index === 0) {
                    carouselItem.classList.add('active');
                }
                const banner = `
                        <img src="${item.url}" class="d-block object-fit-cover w-100" alt="${item.description}" style="width: 500px; height: 450px;">
                        <div class="carousel-caption d-none d-md-block">
                            <h5 style="color: white; text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;">${item.description}</h5>
                        </div>`;

                carouselItem.innerHTML = banner;
                carouselInner.appendChild(carouselItem);
            });
        });
}

renderDetails();
initiateCheckbox();
loadCarousel();