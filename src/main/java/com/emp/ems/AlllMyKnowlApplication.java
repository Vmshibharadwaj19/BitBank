package com.emp.ems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.emp.ems.Repositories")
@EntityScan(basePackages = "com.emp.ems.entities")
public class AlllMyKnowlApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlllMyKnowlApplication.class, args);
    }
}
