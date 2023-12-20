package org.eclipse.jakarta.hello.repositories;
import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import org.eclipse.jakarta.hello.entities.User;
import java.util.stream.Stream;

@Repository
public interface UserRepository  extends CrudRepository <User, String> { // repository containing the methods for interacting with SensorDB entity in mongodb
    Stream<User> findAll();
    Stream<User> findByUserId(Long userId);
    Stream<User> findByUsername(String username);

    default Stream<User> findByEmail(String email) {
        return null;
    }

    Stream<User> findByfullnameIn(String s);


}