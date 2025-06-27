package com.codify.codify_lms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Lombok untuk getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok untuk konstruktor tanpa argumen
@AllArgsConstructor // Lombok untuk konstruktor dengan semua argumen
public class ContentBlock {
    private String type; // Contoh: "text", "image", "video"
    private String value; // Konten aktual (teks, URL gambar, atau URL video)
    private int order; // Urutan blok ini di dalam lesson
}