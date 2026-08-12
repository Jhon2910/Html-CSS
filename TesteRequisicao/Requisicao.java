package webapp;

public class Requisicao {

    private String documento;
    private String metodo;
    private String url;

    public Requisicao(String documento) {
        this.documento = documento;
        String[] linhas = documento.split("\n");
        String primeiraLinha = linhas[0];
        String[] partes = primeiraLinha.split(" ");
        metodo = partes[0];
        url = partes[1];
    }

    public String getMetodo() {
        return metodo;
    }

    public String getURL() {
        return url;
    }

}
