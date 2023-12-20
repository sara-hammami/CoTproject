package org.eclipse.jakarta.hello.controllers;

import java.util.function.Supplier;

public enum UserRoles implements Supplier<String> {
    Client,
    Administrator;
    @Override
    public String get() {
        return this.name();
    }
}