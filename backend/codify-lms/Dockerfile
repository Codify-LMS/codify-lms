# === Stage 1: Build aplikasi Spring Boot ===
# Menggunakan image OpenJDK yang sudah termasuk Maven
FROM openjdk:21-jdk-slim AS builder

# Set working directory di dalam container
WORKDIR /app

# Salin Maven wrapper, pom.xml, dan direktori src/
# Ini membantu caching layer Docker: jika pom.xml tidak berubah, dependensi Maven tidak diunduh ulang
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src/ ./src/

# Pastikan Maven wrapper bisa dieksekusi
RUN chmod +x mvnw

# Bangun aplikasi Spring Boot, lewati tes
RUN ./mvnw clean install -DskipTests

# === Stage 2: Buat image runtime akhir yang lebih kecil ===
# Menggunakan image OpenJDK yang lebih kecil untuk runtime
FROM openjdk:21-jdk-slim

# Set working directory di dalam container
WORKDIR /app

# Salin file JAR dari stage "builder"
# "target/codify-lms-0.0.1-SNAPSHOT.jar" relatif terhadap WORKDIR dari stage builder (/app)
COPY --from=builder /app/target/codify-lms-0.0.1-SNAPSHOT.jar app.jar

# Expose port yang digunakan aplikasi Spring Boot Anda (default adalah 8080)
EXPOSE 8080

# Perintah untuk menjalankan aplikasi Anda saat container dimulai
ENTRYPOINT ["java", "-jar", "app.jar"]