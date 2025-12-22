package com.example.worldpopulation;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@SpringBootApplication
@MapperScan("com.example.worldpopulation.mapper")
public class WorldpopulationApplication {

	public static void main(String[] args) {

		SpringApplication.run(WorldpopulationApplication.class, args);
	}

}
