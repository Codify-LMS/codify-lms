package com.codify.codify_lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(scanBasePackages = "com.codify.codify_lms")
@ComponentScan(basePackages = "com.codify.codify_lms")
@EnableJpaRepositories(basePackages = "com.codify.codify_lms.repository")
public class CodifyLmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodifyLmsApplication.class, args);
	}

}
