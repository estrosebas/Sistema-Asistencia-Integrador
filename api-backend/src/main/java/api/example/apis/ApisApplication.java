package api.example.apis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal para iniciar la aplicación Spring Boot.
 * La anotación @SpringBootApplication marca esta clase como el punto de entrada de la aplicación.
 *
 * @author Sebastian
 */
@SpringBootApplication
public class ApisApplication {

	/**
	 * Método principal que inicia la aplicación Spring Boot.
	 *
	 * @param args Argumentos de línea de comandos.
	 */
	public static void main(String[] args) {
		SpringApplication.run(ApisApplication.class, args);
	}
}
