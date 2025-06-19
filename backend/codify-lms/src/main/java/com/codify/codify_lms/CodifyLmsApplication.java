package com.codify.codify_lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.codify.codify_lms.repository")
public class CodifyLmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodifyLmsApplication.class, args);
	}

}
