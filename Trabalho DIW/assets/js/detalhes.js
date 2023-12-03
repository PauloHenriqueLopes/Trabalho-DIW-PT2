document.addEventListener("DOMContentLoaded", async () => {
  const curiosities = {
    1: "La Bombonera, lar do Club Atlético Boca Juniors, é um dos estádios mais apaixonantes e vibrantes da América do Sul. Inaugurado em 1940, seu nome oficial é Estádio Alberto J. Armando, mas é carinhosamente chamado de (La Bombonera) devido à sua forma parecida com uma caixa de bombons. Com sua arquitetura única e capacidade para criar uma atmosfera elétrica, é famoso por sua inclinação íngreme e por abrigar alguns dos jogos de futebol mais intensos e emocionantes da história.",
    2: "O Estádio do Maracanã, no Rio de Janeiro, é um ícone do futebol mundial. Inaugurado em 1950 para sediar a Copa do Mundo, recebeu finais de Mundiais, grandes jogos e eventos esportivos. Sua capacidade foi testemunha de momentos históricos, incluindo o famoso gol de Pelé na final da Copa de 1970. Sua estrutura imponente e sua história o tornam um dos estádios mais emblemáticos do planeta.",
    3: "O Estádio Governador Magalhães Pinto, conhecido como Mineirão, é um dos principais palcos esportivos do Brasil. Localizado em Belo Horizonte, foi inaugurado em 1965 e tem uma história marcante no futebol brasileiro. Foi palco de partidas lendárias, como a semifinal da Copa do Mundo de 2014 entre Brasil e Alemanha, além de importantes jogos de clubes brasileiros.",
    4: "O Anfield, lar do Liverpool FC, é reverenciado por sua atmosfera apaixonante e história gloriosa. Construído em 1884, testemunhou algumas das maiores noites de futebol da Inglaterra. Seus adeptos apaixonados e a famosa arquibancada (The Kop) tornam cada jogo uma experiência inesquecível. O estádio é um símbolo da identidade e tradição do clube.",
    5: "O Camp Nou é a majestosa casa do FC Barcelona. Inaugurado em 1957, é o maior estádio da Europa e um dos mais icônicos do mundo. Foi palco de momentos lendários do futebol, testemunhando a genialidade de jogadores como Messi e Cruyff. Sua arquitetura imponente e a paixão dos torcedores catalães tornam cada jogo uma experiência única.",
    6: "O Estádio Santiago Bernabéu, localizado no coração de Madrid, é um dos mais emblemáticos do futebol. Inaugurado em 1947 e nomeado em homenagem ao lendário presidente do Real Madrid, Santiago Bernabéu, o estádio passou por várias expansões ao longo dos anos para acomodar a crescente base de fãs e manter-se moderno. Este icônico estádio testemunhou momentos inesquecíveis do futebol, incluindo vitórias na Liga dos Campeões da UEFA e a Copa do Mundo de 1982. Além disso, o Bernabéu é um local versátil, sediando eventos esportivos, concertos e muito mais. Sua história continua a brilhar como um símbolo do Real Madrid e da paixão pelo futebol na Espanha e no mundo.",
    7: "O Estádio Monumental Antonio Vespucio Liberti, conhecido como Monumental de Núñez, é o lendário estádio do Club Atlético River Plate. Inaugurado em 1938, é palco de algumas das maiores conquistas do futebol argentino. Sua atmosfera elétrica e a paixão dos torcedores são marcas registradas, criando um ambiente intimista para os jogadores e fãs.",
    8: "O Signal Iduna Park, também conhecido como Westfalenstadion, é a fortaleza do Borussia Dortmund. Inaugurado em 1974, é reverenciado por sua (Muralha Amarela), uma das arquibancadas mais vibrantes do futebol. Sua atmosfera pulsante e torcida apaixonada fazem dele um dos estádios mais intimidantes e emocionantes da Europa.",
  };

  const selectedCardId = localStorage.getItem("selectedCardId");
  const selectedAlbumId = localStorage.getItem("selectedAlbumId");
  const urlFotos =
    "https://jsonserver-trabalhodiw3.paulo-henriq161.repl.co/fotos";

  if (selectedCardId !== null && selectedAlbumId !== null) {
    await loadImagesForAlbum(selectedAlbumId, selectedCardId);
    updateCuriosityText(selectedAlbumId);
  } else {
    console.error("ID do card ou do álbum não encontrado.");
  }

  const closeButton = document.querySelector(".btn-close");
  closeButton.addEventListener("click", function () {
    const albumId = localStorage.getItem("selectedAlbumId");
    if (albumId !== null) {
      window.location.href = `album.html?id=${albumId}`;
    } else {
      console.error("ID do álbum não encontrado.");
    }
  });

  async function loadImagesForAlbum(albumId, selectedCardId) {
    try {
      const response = await fetch(urlFotos);
      if (!response.ok) {
        throw new Error("Erro ao carregar as fotos:", response.status);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data)) {
        throw new Error(
          "Dados de fotos ausentes ou no formato incorreto:",
          data
        );
      }

      const carouselItems = document.querySelectorAll(".carousel-item");

      const filteredPhotos = data.filter(
        (foto) => foto.id_album === parseInt(albumId)
      );

      if (filteredPhotos.length >= carouselItems.length) {
        carouselItems.forEach((item, index) => {
          const image = item.querySelector("img");
          if (filteredPhotos[index]) {
            image.src = filteredPhotos[index].url_imagem;
            item.classList.remove("active");
            if (index === parseInt(selectedCardId)) {
              item.classList.add("active");
            }
            image.style.borderRadius = "15px";
          } else {
            console.error(
              `Imagem ${index} não encontrada para o álbum ${albumId}`
            );
          }
        });
      } else {
        console.error("Não há imagens suficientes para preencher o carrossel.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function updateCuriosityText(albumId) {
    const curiositiesParagraph = document.getElementById("curiosities");

    if (curiosities[albumId]) {
      curiositiesParagraph.textContent = curiosities[albumId];
    } else {
      console.error(
        "Texto de curiosidades não encontrado para o álbum:",
        albumId
      );
    }
  }
});
