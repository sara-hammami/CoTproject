package org.eclipse.jakarta.hello.entities;

import org.eclipse.jakarta.hello.utils.Argon2Utility;
import jakarta.json.bind.annotation.JsonbVisibility;
import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import org.eclipse.jakarta.hello.controllers.UserRoles;

import java.util.Objects;
import java.util.Set;

@Entity("user")
@JsonbVisibility(FieldPropertyVisibilityStrategy.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @Column
    private String surname;

    @Column
    private String email;

    @Column
    private String password;

    @Column
    private String phone;

    @Column
    private Set<UserRoles> role;

    public User() {
    }

    public User(String name, String surname, String email, String password, Set<UserRoles> role, String phone) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.role = role;
        this.password = password;
        this.phone = phone;
    }

    public void setRoles(Set<UserRoles> roles) {
        this.role = roles;
    }

    public int getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return this.surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFullname() {
        return this.surname + " " + this.name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<UserRoles> getRoles() {
        return role;
    }

    public void setPassword(String password, Argon2Utility argon2Utility) {
        this.password = argon2Utility.hash(password.toCharArray());
    }

    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof User)) {
            return false;
        }
        User user = (User) o;
        return Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), name, surname, email);
    }

    @Override
    public String toString() {
        // Adjust the toString method to include user information
        StringBuilder result = new StringBuilder("User [id=" + this.id + "]: Name=" + this.name +
                ", Surname=" + this.surname + ", email=" + email +
                ", password=" + this.password + ", mobile=" + this.phone +
                ", role=" + this.role);

        return result.toString();
    }
}
