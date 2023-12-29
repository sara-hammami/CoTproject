package org.eclipse.jakarta.hello.boundaries;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.security.enterprise.SecurityContext;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.jakarta.hello.entities.User;
import org.eclipse.jakarta.hello.repositories.UserRepository;

@ApplicationScoped
@Path("profile")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProfileEndpoint {
    @Inject
    private UserRepository repository;

    @Inject
    private SecurityContext securityContext;

    @GET
    public User get() {
        // Get the currently authenticated user's mail
        String authenticatedUserMail = securityContext.getCallerPrincipal().getName();

        // Retrieve the profile information for the authenticated user
        User user = repository.findById(authenticatedUserMail).orElseThrow();
        String passwordhash = ""; // create user with empty string instead of a password
        return new User(user.getName(), user.getfullname(), passwordhash, user.getPermissionLevel());
    }
}
