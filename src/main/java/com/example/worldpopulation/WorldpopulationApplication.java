package com.example.worldpopulation;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.worldpopulation.mapper")
public class WorldpopulationApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorldpopulationApplication.class, args);
	}

}
