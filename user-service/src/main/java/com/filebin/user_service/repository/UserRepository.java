package com.filebin.user_service.repository;

import com.filebin.user_service.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByUsernameOrEmail(String username, String email);
    Optional<User> findByUsername(String username);
    @Query("{ $or: [ { 'username': ?0 }, { 'email': ?0 } ] }")
    Optional<User> findByUsernameOrEmail(String usernameOrEmail);
}
