package com.codify.codify_lms.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Collections; // Import Collections untuk emptyList()

@Converter
public class ContentBlockListConverter implements AttributeConverter<List<ContentBlock>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<ContentBlock> contentBlocks) {
        if (contentBlocks == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(contentBlocks);
        } catch (JsonProcessingException e) {
            // Dalam aplikasi produksi, catat error dengan logger framework (misal SLF4J)
            // throw new RuntimeException("Error converting List<ContentBlock> to JSON string", e);
            System.err.println("Error converting List<ContentBlock> to JSON string: " + e.getMessage());
            return null; // Mengembalikan null atau string kosong jika terjadi error
        }
    }

    @Override
    public List<ContentBlock> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return Collections.emptyList(); // Mengembalikan list kosong daripada null
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<List<ContentBlock>>() {});
        } catch (IOException e) {
            // Dalam aplikasi produksi, catat error dengan logger framework (misal SLF4J)
            // throw new RuntimeException("Error converting JSON string to List<ContentBlock>", e);
            System.err.println("Error converting JSON string to List<ContentBlock>: " + e.getMessage());
            return Collections.emptyList(); // Mengembalikan list kosong jika terjadi error
        }
    }
}