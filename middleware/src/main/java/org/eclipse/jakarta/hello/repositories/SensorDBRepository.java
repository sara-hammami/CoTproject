package org.eclipse.jakarta.hello.repositories;
import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import org.eclipse.jakarta.hello.entities.SensorDB;
import java.util.stream.Stream;
@Repository
public interface SensorDBRepository  extends CrudRepository <SensorDB, String> { // repository containing the methods for interacting with SensorDB entity in mongodb
    Stream<SensorDB> findAll();

}