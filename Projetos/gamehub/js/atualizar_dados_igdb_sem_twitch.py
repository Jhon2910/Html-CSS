
import json
import re
import unicodedata
from pathlib import Path
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed


# ============================================================
# CONFIGURAÇÃO
# ============================================================

INPUT = Path("dados.js")
OUTPUT = Path("dados_IGDB.js")
REPORT = Path("relatorio_IGDB.json")

BASE = "https://app.lizardbyte.dev/GameDB"


# ============================================================
# IDs MANUAIS
#
# Usados somente quando o jogo não foi encontrado
# automaticamente pelo nome.
# ============================================================

IDS_MANUAIS = {
    "Alan Wake 2": 252,
    "Baldur's Gate 3": 32,
    "Binding of Isaac": 78,
    "Civilization V": 285,
    "Civilization VI": 10,
    "Divinity: Original Sin 2": 56,
    "DOOM (2016)": 228,
    "God of War (2018)": 18,
    "Halo: Combat Evolved (Master Chief)": 21,
    "Midnight Club 3": 94,
    "Overwatch 2": 33,
    "Pokemon HeartGold": 104,
    "Spider-Man (2018)": 43,
    "StarCraft II": 15,
    "Tom Clancy's Rainbow Six Siege": 69,
    "Tomb Raider (2013)": 55,
    "UFC 4": 65,
    "Warcraft III": 112,
    "Dredge": 260,
}


# ============================================================
# NORMALIZAÇÃO DE NOMES
# ============================================================

def norm(s):
    if not isinstance(s, str):
        return ""

    s = (
        unicodedata
        .normalize("NFKD", s)
        .encode("ascii", "ignore")
        .decode()
        .lower()
    )

    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def bucket_name(name):
    """
    Usa a mesma lógica de buckets do GameDB.
    """

    n = norm(name)

    if not n:
        return "@"

    # Se o segundo caractere for espaço,
    # usa apenas o primeiro caractere.
    if len(n) > 1 and n[1] == " ":
        return n[0]

    return n[:2]


# ============================================================
# HTTP
# ============================================================

session = requests.Session()

session.headers.update({
    "User-Agent": "GameHub-IGDB-Updater/1.0"
})


def get_json(url):
    response = session.get(url, timeout=30)
    response.raise_for_status()
    return response.json()


# ============================================================
# EXTRAÇÃO DE ID DE IMAGEM
# ============================================================

def image_id_from_url(url):
    """
    O GameDB atualmente fornece imagens assim:

    //images.igdb.com/igdb/image/upload/t_thumb/co24gz.jpg

    Esta função extrai:

    co24gz
    """

    if not isinstance(url, str):
        return None

    match = re.search(
        r"images\.igdb\.com/igdb/image/upload/"
        r"(?:[^/]+/)*"
        r"([^/?#]+)"
        r"(?:\.[a-zA-Z0-9]+)?"
        r"(?:[?#].*)?$",
        url
    )

    if match:
        return match.group(1)

    return None


def find_image_id(obj):
    """
    Procura uma imagem dentro de qualquer estrutura do JSON.

    Suporta tanto:

        {
            "image_id": "co24gz"
        }

    quanto o formato atual do GameDB:

        {
            "id": 99107,
            "url": "//images.igdb.com/.../co24gz.jpg"
        }
    """

    if obj is None:
        return None

    # --------------------------------------------------------
    # STRING
    # --------------------------------------------------------

    if isinstance(obj, str):
        return image_id_from_url(obj)

    # --------------------------------------------------------
    # DICT
    # --------------------------------------------------------

    if isinstance(obj, dict):

        # Primeiro tenta URL diretamente.
        for key in ("url", "image_url", "imageUrl"):
            value = obj.get(key)

            if isinstance(value, str):
                image_id = image_id_from_url(value)

                if image_id:
                    return image_id

        # Compatibilidade com outros formatos.
        for key in (
            "image_id",
            "cloudinary_id",
            "cloudinaryId",
        ):
            value = obj.get(key)

            if isinstance(value, str) and value:
                return value

        # Procura recursivamente.
        for value in obj.values():
            image_id = find_image_id(value)

            if image_id:
                return image_id

    # --------------------------------------------------------
    # LIST
    # --------------------------------------------------------

    elif isinstance(obj, list):

        for value in obj:
            image_id = find_image_id(value)

            if image_id:
                return image_id

    return None


# ============================================================
# ARTWORK / SCREENSHOT
# ============================================================

def get_artwork_id(game):
    """
    Tenta encontrar uma imagem horizontal para o fundo.

    Prioridade:

    1. artworks horizontais
    2. qualquer artwork
    3. screenshots
    """

    # --------------------------------------------------------
    # ARTWORKS
    # --------------------------------------------------------

    artworks = game.get("artworks") or []

    if isinstance(artworks, dict):
        artworks = list(artworks.values())

    if isinstance(artworks, list):

        # Primeiro tenta artwork horizontal.
        for artwork in artworks:

            if not isinstance(artwork, dict):
                continue

            width = artwork.get("width")
            height = artwork.get("height")

            if (
                isinstance(width, (int, float))
                and isinstance(height, (int, float))
                and width >= height
            ):
                image_id = find_image_id(artwork)

                if image_id:
                    return image_id

        # Depois qualquer artwork.
        for artwork in artworks:

            image_id = find_image_id(artwork)

            if image_id:
                return image_id

    # --------------------------------------------------------
    # SCREENSHOTS
    # --------------------------------------------------------

    screenshots = game.get("screenshots") or []

    if isinstance(screenshots, dict):
        screenshots = list(screenshots.values())

    if isinstance(screenshots, list):

        for screenshot in screenshots:

            image_id = find_image_id(screenshot)

            if image_id:
                return image_id

    return None


# ============================================================
# LEITURA DOS JOGOS DO dados.js
# ============================================================

def parse_games(text):
    """
    Extrai somente os nomes dos jogos.

    Não altera o conteúdo original.
    """

    return re.findall(
        r'\bnome:\s*"((?:\\.|[^"\\])*)"',
        text
    )


if not INPUT.exists():

    print()
    print("ERRO: o arquivo dados.js não foi encontrado.")
    print(f"Pasta atual: {Path.cwd()}")
    print()

    raise SystemExit(1)


text = INPUT.read_text(encoding="utf-8")

names = parse_games(text)

unique_names = list(dict.fromkeys(names))


print()
print("========================================")
print(" GameHub -> imagens IGDB")
print("========================================")
print()
print(f"Jogos no arquivo: {len(names)}")
print(f"Nomes únicos: {len(unique_names)}")
print()


# ============================================================
# DOWNLOAD DOS BUCKETS
# ============================================================

needed_buckets = sorted({
    bucket_name(name)
    for name in unique_names
})


print(f"Buckets necessários: {len(needed_buckets)}")
print("Baixando índices...")
print()


buckets = {}

for bucket in needed_buckets:

    url = f"{BASE}/buckets/{bucket}.json"

    try:

        response = session.get(url, timeout=30)
        response.raise_for_status()

        buckets[bucket] = response.json()

        print(f"[OK] bucket {bucket}")

    except Exception as error:

        print(f"[ERRO bucket {bucket}] {error}")


print()
print("Procurando jogos...")
print()


# ============================================================
# ENCONTRAR IDs
# ============================================================

ids = {}

nao_encontrados = []


for name in unique_names:

    bucket = bucket_name(name)

    data = buckets.get(bucket, {})

    target = norm(name)

    candidates = []

    if isinstance(data, dict):

        for game_id, item in data.items():

            if not isinstance(item, dict):
                continue

            game_name = item.get("name")

            if not isinstance(game_name, str):
                continue

            candidates.append(
                (str(game_id), game_name)
            )

    # --------------------------------------------------------
    # PRIMEIRO: MATCH EXATO
    # --------------------------------------------------------

    exact = [
        game_id
        for game_id, game_name in candidates
        if norm(game_name) == target
    ]

    if exact:

        ids[name] = exact[0]

        print(f"[OK] {name}")

        continue

    # --------------------------------------------------------
    # SEGUNDO: MATCH POR CONTENÇÃO
    #
    # Somente se houver exatamente UM candidato.
    #
    # Isso evita associar um jogo à entrada errada.
    # --------------------------------------------------------

    contains = [
        (game_id, game_name)
        for game_id, game_name in candidates
        if (
            target in norm(game_name)
            or norm(game_name) in target
        )
    ]

    if len(contains) == 1:

        ids[name] = contains[0][0]

        print(
            f"[OK parcial] {name} -> "
            f"{contains[0][1]}"
        )

        continue

    # Se houver vários candidatos, não escolhe
    # aleatoriamente.
    nao_encontrados.append(name)


# ============================================================
# IDS MANUAIS
# ============================================================

print()
print("Aplicando IDs manuais...")
print()


for name, game_id in IDS_MANUAIS.items():

    # Só aplica se o jogo realmente existir no arquivo.
    if name not in unique_names:
        continue

    # Só usa ID manual quando ainda não temos um ID.
    if name in ids:
        continue

    ids[name] = str(game_id)

    print(
        f"[MANUAL] {name} -> {game_id}"
    )


# Remove da lista os que agora possuem ID.
nao_encontrados = [
    name
    for name in nao_encontrados
    if name not in ids
]


print()
print("========================================")
print(" RESULTADO DA BUSCA")
print("========================================")
print()
print(f"Jogos no arquivo: {len(names)}")
print(f"Nomes únicos: {len(unique_names)}")
print(f"Encontrados: {len(ids)}")
print(f"Não encontrados: {len(nao_encontrados)}")
print()


if nao_encontrados:

    print("Jogos ainda não encontrados:")

    for name in nao_encontrados:
        print(f" - {name}")

    print()


# ============================================================
# DOWNLOAD DOS REGISTROS DOS JOGOS
# ============================================================

print("Baixando dados dos jogos...")
print()


games = {}


def fetch_game(item):

    name, game_id = item

    url = f"{BASE}/games/{game_id}.json"

    game = get_json(url)

    return name, game


with ThreadPoolExecutor(max_workers=16) as executor:

    futures = [
        executor.submit(fetch_game, item)
        for item in ids.items()
    ]

    for future in as_completed(futures):

        try:

            name, game = future.result()

            games[name] = game

            print(f"[OK] {name}")

        except Exception as error:

            print(
                f"[ERRO game] {error}"
            )


# ============================================================
# CRIAR URLs DAS IMAGENS
# ============================================================

replacements = {}

missing_images = []

missing_backgrounds = []


print()
print("Processando imagens...")
print()


for name, game in games.items():

    # --------------------------------------------------------
    # CAPA
    # --------------------------------------------------------

    cover = find_image_id(
        game.get("cover")
    )

    # --------------------------------------------------------
    # FUNDO
    # --------------------------------------------------------

    artwork = get_artwork_id(game)

    # --------------------------------------------------------
    # CAPA ENCONTRADA
    # --------------------------------------------------------

    if cover:

        imagem = (
            "https://images.igdb.com/"
            "igdb/image/upload/"
            f"t_cover_big/{cover}.webp"
        )

        if artwork:

            fundo = (
                "https://images.igdb.com/"
                "igdb/image/upload/"
                f"t_720p/{artwork}.webp"
            )

        else:

            fundo = None

            missing_backgrounds.append(name)

        replacements[name] = {
            "imagem": imagem,
            "fundo": fundo
        }

    else:

        missing_images.append(name)

        print(
            f"[SEM CAPA] {name}"
        )


# ============================================================
# SUBSTITUIR SOMENTE imagem E fundo
# ============================================================

def replace_entry(match):

    entry = match.group(0)

    # Descobre o nome do jogo dentro do objeto.
    name_match = re.search(
        r'\bnome:\s*"((?:\\.|[^"\\])*)"',
        entry
    )

    if not name_match:
        return entry

    name = name_match.group(1)

    replacement = replacements.get(name)

    if not replacement:
        return entry

    # --------------------------------------------------------
    # imagem
    # --------------------------------------------------------

    entry = re.sub(
        r'\bimagem:\s*"[^"]*"',
        f'imagem: "{replacement["imagem"]}"',
        entry,
        count=1
    )

    # --------------------------------------------------------
    # fundo
    # --------------------------------------------------------

    if replacement["fundo"]:

        entry = re.sub(
            r'\bfundo:\s*"[^"]*"',
            f'fundo: "{replacement["fundo"]}"',
            entry,
            count=1
        )

    return entry


# ============================================================
# LOCALIZAR OBJETOS DOS JOGOS
# ============================================================

pattern = re.compile(
    r'\{\s*id:\s*\d+.*?\n\s*\}',
    re.S
)


out = pattern.sub(
    replace_entry,
    text
)


# ============================================================
# GARANTIA DE SEGURANÇA
# ============================================================

# O arquivo original nunca é sobrescrito.
#
# Se nenhuma imagem foi encontrada, não faz sentido gerar
# um arquivo aparentemente atualizado.

if len(replacements) == 0:

    print()
    print("========================================")
    print(" ATENÇÃO")
    print("========================================")
    print()
    print("Nenhuma imagem IGDB foi encontrada.")
    print()
    print("O arquivo dados.js NÃO foi alterado.")
    print("O arquivo dados_IGDB.js NÃO será gerado.")
    print()

    raise SystemExit(1)


# ============================================================
# SALVAR
# ============================================================

OUTPUT.write_text(
    out,
    encoding="utf-8"
)


# ============================================================
# RELATÓRIO
# ============================================================

report = {
    "jogos_no_arquivo": len(names),
    "nomes_unicos": len(unique_names),
    "encontrados_no_indice": len(ids),
    "jogos_com_imagem_IGDB": len(replacements),
    "sem_imagem": missing_images,
    "sem_fundo": missing_backgrounds,
    "nao_encontrados": nao_encontrados,
    "saida": str(OUTPUT)
}


REPORT.write_text(
    json.dumps(
        report,
        ensure_ascii=False,
        indent=2
    ),
    encoding="utf-8"
)


# ============================================================
# RESULTADO FINAL
# ============================================================

print()
print("========================================")
print(" CONCLUÍDO")
print("========================================")
print()
print(f"Arquivo gerado: {OUTPUT}")
print(f"Total de jogos: {len(names)}")
print(f"Nomes únicos: {len(unique_names)}")
print(
    f"Com imagem IGDB: {len(replacements)}"
)
print(
    f"Sem imagem: {len(missing_images)}"
)
print(
    f"Sem fundo: {len(missing_backgrounds)}"
)
print(
    f"Não encontrados: {len(nao_encontrados)}"
)
print()
print(
    "Foi alterado somente "
    "'imagem' e 'fundo'."
)
print(
    "O arquivo original 'dados.js' "
    "NÃO foi alterado."
)
print(
    "O script NÃO usa Twitch, Client ID, "
    "Client Secret ou token."
)
print()
print("Relatório:", REPORT)
print("========================================")
