mapboxgl.accessToken = 'pk.eyJ1IjoicGhsb3BlczAzMSIsImEiOiJjbHBoaHp4aGowMm9hMmtxc3EwdmRjcjBiIn0.h5Eyj8hMxyQHJ1IvSs-YgA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/navigation-night-v1',
  center: [-50, 0],
  zoom: 2
});

async function loadStadiumData() {
  try {
    const apiUrl = 'https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/albums';
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Erro ao carregar os dados dos estádios:', response.status);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data)) {
      throw new Error('Dados dos estádios ausentes ou no formato incorreto:', data);
    }

    data.forEach(stadium => {
      var marker = new mapboxgl.Marker()
        .setLngLat([stadium.coordenadas[0], stadium.coordenadas[1]])
        .setPopup(new mapboxgl.Popup()
          .setHTML(
            `<div>
              <h3>${stadium.titulo}</h3>
              <img src="./assets/imgs/index/${stadium.url_imagem_capa}" alt="${stadium.titulo}" style="max-width: 100%; height: auto;">
              <p>${stadium.descricao}</p>
            </div>`
          ))
        .addTo(map);
      console.log(stadium.url_imagem_capa);
    });
  } catch (error) {
    console.error(error);
  }
}

loadStadiumData();
