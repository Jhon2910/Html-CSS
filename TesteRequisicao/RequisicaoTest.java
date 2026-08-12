package webapp;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RequisicaoTest {

    @org.junit.jupiter.api.Test
    void testPegarMetodoEURL() {

        String documento = "GET /teste HTTP/1.1\n"
                            + "Host: www.exemplo.com\n"
                            + "Agent: mozilla";

        Requisicao requisicao = new Requisicao(documento);

        assertEquals("GET", requisicao.getMetodo());
        assertEquals("/teste", requisicao.getURL());
    }

    @org.junit.jupiter.api.Test
    void testPegarMetodoEURLMaisElaborada() {

        String documento = "GET /solicitarPdim.html HTTP/1.1\n"
                + "Host: www.exemplo.com\n"
                + "Agent: mozilla";

        Requisicao requisicao = new Requisicao(documento);

        assertEquals("GET", requisicao.getMetodo());
        assertEquals("/solicitarPudim.html", requisicao.getURL());
    }
}
