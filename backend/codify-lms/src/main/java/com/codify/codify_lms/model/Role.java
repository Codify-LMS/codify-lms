package com.codify.codify_lms.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    USER,
    ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        return value != null ? Role.valueOf(value.toUpperCase()) : null;
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
