const urlFotos =
  "https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/fotos";
const albumContainer = document.getElementById("albumContainer");
const albumTitleElement = document.getElementById("albumTitle");

const urlParams = new URLSearchParams(window.location.search);
const albumId = urlParams.get('id');

async function createAlbumCards(albumId) {
  try {
    const response = await fetch(urlFotos);
    if (!response.ok) {
      throw new Error("Erro ao carregar as fotos:", response.status);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data)) {
      throw new Error("Dados de fotos ausentes ou no formato incorreto:", data);
    }

    const albumContainer = document.getElementById("albumContainer");
    if (!albumContainer) {
      throw new Error("Elemento albumContainer não encontrado.");
    }

    let cardHTML = "";
    let cardId = 0;

    const filteredPhotos = data.filter(
      (foto) => foto.id_album === parseInt(albumId)
    );

    filteredPhotos.forEach((foto, index) => {
      if (index % 4 === 0) {
        cardHTML += '<div class="row mt-3">';
      }

      cardHTML += `
                <div class="col-lg-3 col-md-3 col-sm-6 mb-3 d-flex align-items-stretch" data-card-id="${cardId}">
                    <div class="card mx-auto bg-dark" style="width: 22rem">
                        <img src="${foto.url_imagem}" class="card-img-top" alt="..." style="height: 200px; object-fit: cover;">
                        <div class="card-body bg-dark radius-2 text-light">
                            <h5 class="card-title">${foto.descricao}</h5>
                            <p class="card-text">${foto.autor}</p>
                            <div class="mt-auto">
                                <a href="item.html" class="btn btn-primary mt-auto">Detalhes</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

      cardId++;

      if ((index + 1) % 4 === 0 || index === data.length - 1) {
        cardHTML += "</div>";
      }
    });

    albumContainer.innerHTML = cardHTML;

    const cards = albumContainer.querySelectorAll(".col-lg-3");
    cards.forEach((card, index) => {
      card.addEventListener("click", function (event) {
        const cardId = index;
        localStorage.setItem("selectedCardId", cardId);
        localStorage.setItem("selectedAlbumId", albumId);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

const urlAlbum =
  "https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/albums";

async function loadAlbumInfo(albumId) {
  try {
    const response = await fetch(urlAlbum + `/${albumId}`);
    if (!response.ok) {
      throw new Error(
        "Erro ao carregar informações do álbum:",
        response.status
      );
    }

    const albumData = await response.json();
    if (!albumData) {
      throw new Error(
        "Dados do álbum ausentes ou no formato incorreto:",
        albumData
      );
    }

    albumTitleElement.textContent = `Álbum ${albumData.titulo}`;
    const albumDescription = document.getElementById("albumDescription");
    const albumLocation = document.getElementById("albumLocation");
    const albumDate = document.getElementById("albumDate");
    const albumImage = document.querySelector(".rounded-5");

    albumDescription.textContent = albumData.descricao;
    albumLocation.textContent = `${albumData.coordenadas}`;
    albumDate.textContent = `${albumData.data}`;
    albumImage.setAttribute("src", `../imgs/index/${albumData.url_imagem_capa}`);


    createAlbumCards(albumId);
  } catch (error) {
    console.error(error);
  }
}

const buttons = albumContainer.querySelectorAll(".btn-primary");
buttons.forEach((button) => {
  button.addEventListener("click", function (event) {
    // Impede o comportamento padrão do link
    event.preventDefault();
    // Adicione aqui a lógica para redirecionar para "/caminho/para/o/detalhes.html"
    // Pode usar os dados armazenados no localStorage
    const selectedCardId = localStorage.getItem("selectedCardId");
    const selectedAlbumId = localStorage.getItem("selectedAlbumId");
    window.location.href = "/caminho/para/o/detalhes.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  loadAlbumInfo(albumId);
  createAlbumCards(albumId);
});