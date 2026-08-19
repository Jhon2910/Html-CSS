package webapp;

public class Pagina {
    public String getHtml(){
        return """
                <!DOCTYPE html>
                <html>
                <body>
                <h1>Você é uma pessoa muito gata!</h1>
                <img src="https://placekittens.com">
                </body>
                </html>
                """;
    }
}
