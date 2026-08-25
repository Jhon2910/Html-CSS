package com.gamehub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gamehub.dto.JogoResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class IgdbService {

    @Value("${igdb.client-id:}")
    private String clientId;

    @Value("${igdb.client-secret:}")
    private String clientSecret;

    @Value("${igdb.api-url:https://api.igdb.com/v4}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String accessToken = null;
    private long tokenExpiresAt = 0;

    /**
     * Autenticação OAuth2 automática com a Twitch para obter o Token de Acesso
     */
    private synchronized String obterTokenDeAcesso() {
        if (accessToken != null && System.currentTimeMillis() < tokenExpiresAt) {
            return accessToken;
        }

        if (clientId == null || clientId.isEmpty() || clientSecret == null || clientSecret.isEmpty() ||
            clientId.contains("seu_client_id")) {
            return null; // Credenciais ainda não configuradas pelo usuário
        }

        try {
            String tokenUrl = String.format(
                "https://id.twitch.tv/oauth2/token?client_id=%s&client_secret=%s&grant_type=client_credentials",
                clientId.trim(), clientSecret.trim()
            );

            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, null, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                this.accessToken = (String) response.getBody().get("access_token");
                Integer expiresIn = (Integer) response.getBody().get("expires_in");
                this.tokenExpiresAt = System.currentTimeMillis() + ((expiresIn != null ? expiresIn : 3600) - 300) * 1000L;
                return this.accessToken;
            }
        } catch (Exception e) {
            System.err.println("Erro ao autenticar com a Twitch / IGDB API: " + e.getMessage());
        }

        return null;
    }

    /**
     * Executa uma consulta Apicalypse na API do IGDB
     */
    private JsonNode consultarIgdb(String endpoint, String queryBody) {
        String token = obterTokenDeAcesso();
        if (token == null) return null;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Client-ID", clientId.trim());
            headers.set("Authorization", "Bearer " + token);
            headers.setContentType(MediaType.TEXT_PLAIN);

            HttpEntity<String> entity = new HttpEntity<>(queryBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl + "/" + endpoint,
                HttpMethod.POST,
                entity,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return objectMapper.readTree(response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Erro ao consultar IGDB endpoint " + endpoint + ": " + e.getMessage());
        }

        return null;
    }

    /**
     * Lista jogos da API do IGDB com capas oficiais, fundos HD, notas e vídeos
     */
    public List<JogoResponseDTO> listarJogosPopulares(int limite) {
        String query = "fields id, name, summary, storyline, rating, total_rating, first_release_date, " +
                       "cover.image_id, artworks.image_id, screenshots.image_id, " +
                       "genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, " +
                       "videos.video_id, language_supports.language.name; " +
                       "sort total_rating_count desc; " +
                       "where cover != null & rating != null; " +
                       "limit " + (limite > 0 ? limite : 50) + ";";

        JsonNode nodes = consultarIgdb("games", query);
        List<JogoResponseDTO> lista = new ArrayList<>();

        if (nodes != null && nodes.isArray()) {
            for (JsonNode node : nodes) {
                lista.add(converterJsonParaJogoDTO(node));
            }
        }

        return lista;
    }

    /**
     * Busca um jogo específico pelo ID da IGDB
     */
    public JogoResponseDTO buscarJogoPorId(Long igdbId) {
        String query = "fields id, name, summary, storyline, rating, total_rating, first_release_date, " +
                       "cover.image_id, artworks.image_id, screenshots.image_id, " +
                       "genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, " +
                       "videos.video_id, language_supports.language.name; " +
                       "where id = " + igdbId + ";";

        JsonNode nodes = consultarIgdb("games", query);
        if (nodes != null && nodes.isArray() && nodes.size() > 0) {
            return converterJsonParaJogoDTO(nodes.get(0));
        }

        return null;
    }

    /**
     * Busca jogos por termo/nome
     */
    public List<JogoResponseDTO> buscarJogosPorNome(String termo) {
        String query = "search \"" + termo.replace("\"", "") + "\"; " +
                       "fields id, name, summary, storyline, rating, total_rating, first_release_date, " +
                       "cover.image_id, artworks.image_id, screenshots.image_id, " +
                       "genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, " +
                       "videos.video_id, language_supports.language.name; " +
                       "limit 30;";

        JsonNode nodes = consultarIgdb("games", query);
        List<JogoResponseDTO> lista = new ArrayList<>();

        if (nodes != null && nodes.isArray()) {
            for (JsonNode node : nodes) {
                lista.add(converterJsonParaJogoDTO(node));
            }
        }

        return lista;
    }

    /**
     * Converte o payload JSON retornado pela IGDB para o padrão JogoResponseDTO
     */
    private JogoResponseDTO converterJsonParaJogoDTO(JsonNode node) {
        Long id = node.path("id").asLong();
        String nome = node.path("name").asText("Jogo Sem Nome");

        // Capa Vertical (t_cover_big ou t_720p)
        String coverImageId = node.path("cover").path("image_id").asText("");
        String imagem = !coverImageId.isEmpty()
            ? "https://images.igdb.com/igdb/image/upload/t_cover_big/" + coverImageId + ".jpg"
            : "https://cdn2.steamgriddb.com/grid/6703fa1a9aa669046522c079ce851cf5.png";

        // Imagem de Fundo Widescreen (t_1080p de Artworks ou Screenshots)
        String bgImageId = "";
        if (node.has("artworks") && node.path("artworks").size() > 0) {
            bgImageId = node.path("artworks").get(0).path("image_id").asText("");
        } else if (node.has("screenshots") && node.path("screenshots").size() > 0) {
            bgImageId = node.path("screenshots").get(0).path("image_id").asText("");
        }
        String fundo = !bgImageId.isEmpty()
            ? "https://images.igdb.com/igdb/image/upload/t_1080p/" + bgImageId + ".jpg"
            : imagem;

        // Nota (Convertida de 0-100 da IGDB para 0.0-5.0)
        BigDecimal nota = null;
        if (node.has("rating") && !node.path("rating").isNull()) {
            double rating100 = node.path("rating").asDouble();
            nota = BigDecimal.valueOf(rating100 / 20.0).setScale(1, RoundingMode.HALF_UP);
        }

        // Data de Lançamento
        String lancamento = "Em Breve";
        boolean lancado = false;
        if (node.has("first_release_date") && !node.path("first_release_date").isNull()) {
            long unixSeconds = node.path("first_release_date").asLong();
            Instant instant = Instant.ofEpochSecond(unixSeconds);
            lancamento = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                .withZone(ZoneId.of("UTC"))
                .format(instant);
            lancado = instant.isBefore(Instant.now());
        }

        // Desenvolvedora
        String desenvolvedora = "Estúdio Independente";
        if (node.has("involved_companies") && node.path("involved_companies").isArray()) {
            for (JsonNode ic : node.path("involved_companies")) {
                if (ic.path("developer").asBoolean(false)) {
                    desenvolvedora = ic.path("company").path("name").asText("Estúdio");
                    break;
                }
            }
            if (desenvolvedora.equals("Estúdio Independente") && node.path("involved_companies").size() > 0) {
                desenvolvedora = node.path("involved_companies").get(0).path("company").path("name").asText("Estúdio");
            }
        }

        // Gênero / Categoria
        String categoria = "Ação/Aventura";
        if (node.has("genres") && node.path("genres").size() > 0) {
            categoria = node.path("genres").get(0).path("name").asText("Ação");
        }

        // Plataformas
        List<String> plats = new ArrayList<>();
        if (node.has("platforms") && node.path("platforms").isArray()) {
            for (JsonNode p : node.path("platforms")) {
                plats.add(p.path("name").asText());
            }
        }
        String plataformas = !plats.isEmpty() ? String.join(", ", plats) : "PC, PlayStation, Xbox";

        // Idiomas
        List<String> langs = new ArrayList<>();
        if (node.has("language_supports") && node.path("language_supports").isArray()) {
            for (JsonNode l : node.path("language_supports")) {
                String langName = l.path("language").path("name").asText();
                if (!langName.isEmpty() && !langs.contains(langName)) {
                    langs.add(langName);
                }
            }
        }
        String idiomas = !langs.isEmpty() ? String.join(", ", langs) : "Português (Brasil), Inglês, Espanhol, Francês, Alemão";

        // Trailer do YouTube
        String trailerId = "";
        if (node.has("videos") && node.path("videos").size() > 0) {
            trailerId = node.path("videos").get(0).path("video_id").asText("");
        }
        String trailer = !trailerId.isEmpty() ? "https://www.youtube.com/embed/" + trailerId : "";
        String trailerUrl = !trailerId.isEmpty() ? "https://www.youtube.com/watch?v=" + trailerId : "";

        // Descrições
        String resumo = node.path("summary").asText("");
        String historia = node.path("storyline").asText(resumo);
        String descricaoCurta = resumo.length() > 140 ? resumo.substring(0, 137) + "..." : resumo;

        return new JogoResponseDTO(
            id,
            nome,
            nome,
            categoria,
            categoria,
            imagem,
            fundo,
            nota,
            lancado,
            desenvolvedora,
            lancamento,
            plataformas,
            idiomas,
            idiomas,
            idiomas.toLowerCase().contains("portuguese") || idiomas.toLowerCase().contains("português"),
            true,
            trailer,
            trailerUrl,
            descricaoCurta,
            descricaoCurta,
            historia.isEmpty() ? resumo : historia,
            historia.isEmpty() ? resumo : historia
        );
    }
}
