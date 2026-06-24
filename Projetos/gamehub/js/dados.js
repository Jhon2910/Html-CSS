const listaDeJogos = [
  {
    id: 1,
    nome: "Grand Theft Auto VI",
    categoria: "Ação",
    imagem: "img/gta-vi.png",
    nota: 4.9,
    descricaoCurta: "O aguardado retorno da franquia GTA em Vice City.",
    descricaoLonga:
      "Grand Theft Auto VI leva os jogadores de volta a Vice City em uma experiência de mundo aberto gigantesca, com dois protagonistas, missões variadas e um nível de realismo sem precedentes.",
    desenvolvedora: "Rockstar Games",
    lancamento: "19/11/2026",
    plataformas: "PS5, Xbox Series X/S",
  },
  {
    id: 2,
    nome: "Red Dead Redemption 2",
    categoria: "Aventura",
    imagem: "img/red-dead-redemption-2.jpg",
    nota: 4.9,
    descricaoCurta: "Uma épica jornada no Velho Oeste americano.",
    descricaoLonga:
      "Acompanhe Arthur Morgan e a gangue Van der Linde em uma história emocionante sobre lealdade, sobrevivência e mudança durante o fim da era dos fora da lei.",
    desenvolvedora: "Rockstar Games",
    lancamento: "26/10/2018",
    plataformas: "PC, PS4, Xbox One",
  },
  {
    id: 3,
    nome: "The Last of Us Part I",
    categoria: "Ação",
    imagem: "img/the-last-of-us-part-i.jpg",
    nota: 4.8,
    descricaoCurta: "A jornada de Joel e Ellie em um mundo devastado.",
    descricaoLonga:
      "Remake completo do clássico da Naughty Dog, apresentando gráficos modernizados e uma das histórias mais marcantes dos videogames.",
    desenvolvedora: "Naughty Dog",
    lancamento: "02/09/2022",
    plataformas: "PC, PS5",
  },
  {
    id: 4,
    nome: "The Last of Us Part II",
    categoria: "Ação",
    imagem: "img/the-last-of-us-part-ii.png",
    nota: 4.7,
    descricaoCurta: "Uma história intensa de vingança e sobrevivência.",
    descricaoLonga:
      "Ellie embarca em uma jornada perigosa em busca de vingança, enfrentando dilemas morais e desafios emocionais em um mundo pós-apocalíptico.",
    desenvolvedora: "Naughty Dog",
    lancamento: "19/06/2020",
    plataformas: "PS4, PS5",
  },
  {
    id: 5,
    nome: "God of War Ragnarök",
    categoria: "Ação",
    imagem: "img/god-of-war-ragnarok.jpg",
    nota: 4.9,
    descricaoCurta: "Kratos e Atreus enfrentam o fim dos tempos nórdicos.",
    descricaoLonga:
      "Viaje pelos Nove Reinos e enfrente deuses e monstros em uma aventura épica baseada na mitologia nórdica.",
    desenvolvedora: "Santa Monica Studio",
    lancamento: "09/11/2022",
    plataformas: "PS4, PS5",
  },
  {
    id: 6,
    nome: "Uncharted 4: A Thief's End",
    categoria: "Aventura",
    imagem: "img/uncharted-4.jpg",
    nota: 4.8,
    descricaoCurta: "Nathan Drake retorna para sua última grande aventura.",
    descricaoLonga:
      "Explore ruínas antigas, descubra tesouros lendários e viva uma história cinematográfica repleta de ação e mistério.",
    desenvolvedora: "Naughty Dog",
    lancamento: "10/05/2016",
    plataformas: "PC, PS4, PS5",
  },
  {
    id: 7,
    nome: "007 First Light",
    categoria: "Ação",
    imagem: "img/007-first-light.jpg",
    nota: 4.6,
    descricaoCurta: "A origem do agente secreto James Bond.",
    descricaoLonga:
      "Assuma o papel de um jovem James Bond e descubra como ele conquistou seu famoso código 007 em uma aventura cheia de espionagem.",
    desenvolvedora: "IO Interactive",
    lancamento: "2026",
    plataformas: "PC, PS5, Xbox Series X/S",
  },
  {
    id: 8,
    nome: "Batman: Arkham Knight",
    categoria: "Ação",
    imagem: "img/batman-arkham-knight.jpg",
    nota: 4.8,
    descricaoCurta: "A batalha final do Cavaleiro das Trevas em Gotham.",
    descricaoLonga:
      "Enfrente Espantalho, Arkham Knight e diversos vilões clássicos utilizando o Batmóvel e todas as habilidades do Batman.",
    desenvolvedora: "Rocksteady Studios",
    lancamento: "23/06/2015",
    plataformas: "PC, PS4, Xbox One",
  },
  {
    id: 9,
    nome: "Marvel's Spider-Man 2",
    categoria: "Ação",
    imagem: "img/marvels-spider-man-2.jpeg",
    nota: 4.8,
    descricaoCurta: "Peter Parker e Miles Morales enfrentam Venom.",
    descricaoLonga:
      "Balance pelas ruas de Nova York com dois Homens-Aranha e enfrente ameaças como Kraven e Venom em uma aventura espetacular.",
    desenvolvedora: "Insomniac Games",
    lancamento: "20/10/2023",
    plataformas: "PS5",
  },
  {
    id: 10,
    nome: "Elden Ring",
    categoria: "RPG",
    imagem: "img/elden-ring.jpg",
    nota: 4.9,
    descricaoCurta: "Explore as Terras Intermédias em um RPG épico.",
    descricaoLonga:
      "Criado pela FromSoftware, Elden Ring combina exploração em mundo aberto, combates desafiadores e uma rica mitologia.",
    desenvolvedora: "FromSoftware",
    lancamento: "25/02/2022",
    plataformas: "PC, PS4, PS5, Xbox One, Xbox Series X/S",
  },
  {
  id: 11,
  nome: "Need for Speed: Most Wanted",
  categoria: "Corrida",
  imagem: "img/nfs-most-wanted.jpg",
  nota: 4.8,
  descricaoCurta: "Torne-se o piloto mais procurado de Rockport.",
  descricaoLonga:
    "Um dos jogos de corrida mais icônicos de todos os tempos. Vença rivais, fuja da polícia e domine a Lista Negra para se tornar o corredor mais procurado da cidade.",
  desenvolvedora: "EA Black Box",
  lancamento: "15/11/2005",
  plataformas: "PC, PS2, Xbox, GameCube",
},
{
  id: 12,
  nome: "Forza Horizon 6",
  categoria: "Corrida",
  imagem: "img/forza-horizon-6.jpeg",
  nota: 4.9,
  descricaoCurta: "O maior festival automotivo em mundo aberto.",
  descricaoLonga:
    "Explore cenários impressionantes, participe de corridas e eventos e monte sua coleção de carros em uma experiência de corrida arcade de última geração.",
  desenvolvedora: "Playground Games",
  lancamento: "2026",
  plataformas: "PC, Xbox Series X/S",
},
{
  id: 13,
  nome: "Horizon Zero Dawn Remastered",
  categoria: "Aventura",
  imagem: "img/horizon-zero-dawn-remastered.jpg",
  nota: 4.8,
  descricaoCurta: "A jornada de Aloy em gráficos renovados.",
  descricaoLonga:
    "Explore um mundo dominado por máquinas colossais e descubra os segredos do passado da humanidade nesta versão remasterizada do clássico da Guerrilla Games.",
  desenvolvedora: "Guerrilla Games",
  lancamento: "31/10/2024",
  plataformas: "PC, PS5",
},
{
  id: 14,
  nome: "Resident Evil 4 Remake",
  categoria: "Terror",
  imagem: "img/resident-evil-4-remake.jpg",
  nota: 4.9,
  descricaoCurta: "Leon enfrenta um pesadelo em uma vila isolada.",
  descricaoLonga:
    "Remake do clássico de survival horror da Capcom, trazendo gráficos modernos, combate aprimorado e uma atmosfera ainda mais assustadora.",
  desenvolvedora: "Capcom",
  lancamento: "24/03/2023",
  plataformas: "PC, PS4, PS5, Xbox Series X/S",
},
{
  id: 15,
  nome: "Little Nightmares",
  categoria: "Terror",
  imagem: "img/little-nightmares.png",
  nota: 4.6,
  descricaoCurta: "Uma aventura sombria pelos medos da infância.",
  descricaoLonga:
    "Controle Six enquanto tenta escapar de um misterioso navio habitado por criaturas grotescas em um mundo assustador e fascinante.",
  desenvolvedora: "Tarsier Studios",
  lancamento: "28/04/2017",
  plataformas: "PC, PS4, Xbox One, Switch",
},
{
  id: 16,
  nome: "Resident Evil 7: Biohazard",
  categoria: "Terror",
  imagem: "img/resident-evil-7.jpg",
  nota: 4.8,
  descricaoCurta: "O retorno do terror à franquia Resident Evil.",
  descricaoLonga:
    "Preso na propriedade da família Baker, Ethan Winters precisa sobreviver a horrores inimagináveis em uma experiência de terror em primeira pessoa.",
  desenvolvedora: "Capcom",
  lancamento: "24/01/2017",
  plataformas: "PC, PS4, PS5, Xbox One, Xbox Series X/S",
},
{
  id: 17,
  nome: "Mortal Kombat 1",
  categoria: "Luta",
  imagem: "img/mortal-kombat-1.jpeg",
  nota: 4.7,
  descricaoCurta: "Uma nova era do universo Mortal Kombat criada por Liu Kang.",
  descricaoLonga:
    "Mortal Kombat 1 reinicia a linha do tempo da franquia com versões inéditas dos personagens clássicos. O jogo traz combates brutais, Fatalities icônicos, sistema de Lutadores de Parceria (Kameo Fighters) e um modo história cinematográfico.",
  desenvolvedora: "NetherRealm Studios",
  lancamento: "19/09/2023",
  plataformas: "PC, PS5, Xbox Series X/S, Nintendo Switch",
},
];

const listaDeNoticias = [
  {
    data: "24 JUN 2026",
    titulo: "GTA 6 terá preço acima do padrão e custará até US$ 100, confirma Rockstar",
    resumo:
      "O aguardado Grand Theft Auto VI chega custando US$ 80 em sua versão padrão, o que pode abrir a porteira para que mais jogos comecem a cobrar esse valor. Confira mais detalhes.",
  },
  {
    data: "20 JUN 2026",
    titulo: "Resident Evil Veronica e o remake de Zero se conectam a Resident Evil Requiem, diz insider",
    resumo:
      "O remake de Resident Evil Veronica terá conexão direta com Resident Evil Requiem",
  },
  {
    data: "12 JUN 2026",
    titulo: "Valve confirma novo console portátil",
    resumo:
      "Após o sucesso do Steam Deck, a Valve apresentou oficialmente seu novo dispositivo portátil com hardware atualizado e maior autonomia de bateria.",
  },
  {
    data: "09 JUN 2026",
    titulo: "PlayStation 5 ultrapassa nova marca de vendas",
    resumo:
      "O PS5 continua dominando o mercado de consoles e alcançou mais uma marca histórica em unidades vendidas mundialmente.",
  },
  {
    data: "06 JUN 2026",
    titulo: "Escassez de memória RAM preocupa fabricantes",
    resumo:
      "A crescente demanda por inteligência artificial e data centers está pressionando a produção de memória RAM e elevando os preços do mercado.",
  },
  {
    data: "03 JUN 2026",
    titulo: "Forza Horizon 6 recebe atualização gratuita",
    resumo:
      "Novos carros, eventos sazonais e melhorias de desempenho chegam ao mais recente jogo de corrida da Playground Games.",
  },
  {
    data: "31 MAI 2026",
    titulo: "Mortal Kombat 1 anuncia novo lutador DLC",
    resumo:
      "A NetherRealm Studios confirmou a chegada de um personagem muito pedido pela comunidade para o elenco do jogo.",
  },
  {
    data: "28 MAI 2026",
    titulo: "Marvel's Spider-Man 2 ganha expansão",
    resumo:
      "A Insomniac Games revelou uma expansão inédita com novas missões, trajes e vilões para Peter Parker e Miles Morales.",
  },
  {
    data: "24 MAI 2026",
    titulo: "God of War Ragnarök alcança marco histórico",
    resumo:
      "O título da Santa Monica Studio ultrapassou mais uma importante marca de vendas e continua entre os jogos mais populares da PlayStation.",
  },
  {
    data: "20 MAI 2026",
    titulo: "Resident Evil 4 Remake supera expectativas",
    resumo:
      "A Capcom divulgou novos números de vendas e confirmou que o remake continua sendo um dos maiores sucessos recentes da empresa.",
  }
];