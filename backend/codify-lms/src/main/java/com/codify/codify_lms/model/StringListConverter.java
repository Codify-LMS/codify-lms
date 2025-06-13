// backend/codify-lms/src/main/java/com/codify/codify_lms/model/StringListConverter.java
package com.codify.codify_lms.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> stringList) {
        if (stringList == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(stringList);
        } catch (IOException e) {
            // Handle the exception properly in a real application
            throw new RuntimeException("Error converting List<String> to JSON string", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<List<String>>() {});
        } catch (IOException e) {
            // Handle the exception properly in a real application
            throw new RuntimeException("Error converting JSON string to List<String>", e);
        }
    }
}