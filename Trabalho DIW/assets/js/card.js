const url = "https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/albums";

async function createAlbumCards() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao carregar os álbuns:", response.status);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data)) {
      throw new Error(
        "Dados de álbuns ausentes ou no formato incorreto:",
        data
      );
    }

    const albumContainer = document.getElementById("albumContainer");
    if (!albumContainer) {
      throw new Error("Elemento albumContainer não encontrado.");
    }

    const responseDest = await fetch(
      "https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/destaques"
    );
    if (!responseDest.ok) {
      throw new Error("Erro ao carregar destaques:", responseDest.status);
    }

    const destaques = await responseDest.json();
    if (!destaques || !Array.isArray(destaques)) {
      throw new Error(
        "Dados de destaques ausentes ou no formato incorreto:",
        destaques
      );
    }

    let cardHTML = "<div class='row row-cols-1 row-cols-md-4 g-4 mt-5'>";

    data.forEach((album, index) => {
      const albumId = index + 1;
      const favoriteButtonId = `favoriteBtn_${albumId}`;
      const isAlbumFavorited = destaques.some(
        (destaque) => destaque.id_album_destaque === albumId
      );
    
      cardHTML += `
        <div class="col mb-3">
          <div class="card mx-auto bg-dark" style="width: 25rem">
            <img src="./assets/imgs/index/${album.url_imagem_capa}" class="card-img-top" alt="..." onclick="preventLink(event)" />
            <div class="card-body bg-dark radius-2 text-light">
              <h5 class="card-title">${album.titulo}</h5>
              <p class="card-text">${album.descricao}</p>
              <div class="mt-auto card-buttons">
                <button id="${favoriteButtonId}" class="btn btn-primary mt-auto favorite-btn" onclick="handleFavoriteClick(${albumId}, '${album.titulo}', this, ${isAlbumFavorited})">${isAlbumFavorited ? "Destaques" : "Adicionar aos Destaques"}</button>
                <a href="./assets/pages/album.html?id=${albumId}" class="btn btn-primary mt-auto">Ver Álbum</a>
              </div>
            </div>
          </div>
        </div>
      `;

      
      if ((index + 1) % 4 === 0) {
        cardHTML += `</div><div class='row row-cols-1 row-cols-md-4 g-4 mt-3'>`;
      }
    });

    cardHTML += "</div>"; 

    albumContainer.innerHTML = cardHTML;
  } catch (error) {
    console.error(error);
  }
}

async function handleFavoriteClick(
  albumId,
  stadiumName,
  button,
  isAlbumFavorited
) {
  try {
    const response = await fetch(
      "https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/destaques"
    );

    if (!response.ok) {
      throw new Error("Erro ao carregar destaques");
    }

    const destaques = await response.json();
    if (!destaques || !Array.isArray(destaques)) {
      throw new Error("Dados de destaques ausentes ou no formato incorreto");
    }

    const albumDestaque = destaques.find(
      (destaque) => destaque.id_album_destaque === albumId
    );

    if (isAlbumFavorited && albumDestaque) {
      
      const removeResponse = await fetch(
        `https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/destaques/${albumDestaque.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!removeResponse.ok) {
        throw new Error("Erro ao remover destaque");
      }

      console.log("Destaque removido com sucesso!");
      button.classList.remove("favorite-clicked");
      button.disabled = false;
    } else {
    
      const addResponse = await fetch(
        "https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/destaques",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_album_destaque: albumId,
            nome_estadio: `Estádio ${stadiumName}`, 
            texto: `Estádio ${stadiumName}`, 
          }),
        }
      );

      if (!addResponse.ok) {
        throw new Error("Erro ao adicionar álbum aos destaques");
      }

      console.log("Álbum adicionado aos destaques com sucesso!");
      button.classList.add("favorite-clicked");
      button.disabled = true;
    }
    window.location.reload();
  } catch (error) {
      console.error("Erro:", error);
  }
}

async function loadCarouselItems() {
  try {
    const response = await fetch(
      "https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/destaques"
    );
    if (!response.ok) {
      throw new Error("Erro ao carregar destaques:", response.status);
    }

    const destaques = await response.json();
    if (!destaques || !Array.isArray(destaques)) {
      throw new Error(
        "Dados de destaques ausentes ou no formato incorreto:",
        destaques
      );
    }

    const carouselInner = document.getElementById("carouselInner");
    if (!carouselInner) {
      throw new Error("Elemento carouselInner não encontrado.");
    }

    carouselInner.innerHTML = "";

    destaques.forEach((destaque, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");

      if (index === 0) {
        carouselItem.classList.add("active");
      }

      const albumId = destaque.id_album_destaque;
      const fotoPath = `./assets/imgs/index/foto${albumId}.jpg`;

      carouselItem.innerHTML = `
        <img src="${fotoPath}" style="height: 400px" class="d-block w-100" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h5>${destaque.texto}</h5>
        </div>
      `;

      carouselInner.appendChild(carouselItem);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createAlbumCards();
  loadCarouselItems();
});
