package com.example.worldpopulation.mapper;

import com.example.worldpopulation.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    
    Optional<User> findByUsername(@Param("username") String username);
    
    Optional<User> findByEmail(@Param("email") String email);
    
    Optional<User> findById(@Param("id") Long id);
    
    List<User> findAll();
    
    void insert(User user);
    
    void update(User user);
    
    void delete(@Param("id") Long id);
}