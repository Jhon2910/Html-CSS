package webapp;

import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class Resposta {

    private int codigoStatus;
    private String msgStatus;
    private String contentType;
    private int contentLength;
    private String body;
    private String date;

    public Resposta() {
        this.date = ZonedDateTime.now(ZoneOffset.UTC)
                .format(DateTimeFormatter.RFC_1123_DATE_TIME);
    }

    public void setStatus(int codigo, String msg) {
        codigoStatus = codigo;
        msgStatus = msg;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public void setBody(String body) {
        this.body = body;
        this.contentLength = body.getBytes(StandardCharsets.UTF_8).length;
    }

    public String getDocumentoBruto() {
        return ("HTTP/1.1 %d %s\r\n" +
                "Date: %s\r\n" +
                "Content-Type: %s\r\n" +
                "Content-Length: %d\r\n" +
                "Connection: close\r\n" +
                "\r\n" +
                "%s").formatted(codigoStatus, msgStatus, date,
                contentType, contentLength, body);
    }
}
