# Menggunakan image OpenJDK 21 sebagai base image
FROM openjdk:21-jdk-slim

# Menentukan argumen BUILD_DIR dengan nilai default "target"
# Ini adalah folder di mana Maven akan menghasilkan JAR Anda
ARG BUILD_DIR=target

# Menentukan argumen JAR_FILE dengan nama JAR yang dihasilkan oleh Maven
# Pastikan nama ini sesuai dengan nama file JAR Anda di folder target
ARG JAR_FILE=codify-lms-0.0.1-SNAPSHOT.jar

# Menambahkan JAR aplikasi Anda ke dalam container
# Path di sisi kiri adalah di dalam konteks build Docker (root directory Anda di Render setelah Build Command)
# Path di sisi kanan adalah di dalam container Docker (akan menjadi /app.jar)
COPY ${BUILD_DIR}/${JAR_FILE} app.jar

# Mengekspos port yang digunakan aplikasi Spring Boot Anda (default: 8080)
# Ini memberi tahu Docker bahwa container akan mendengarkan di port ini
EXPOSE 8080

# Menjalankan aplikasi JAR saat container Docker dimulai
ENTRYPOINT ["java", "-jar", "/app.jar"]

# Opsional: Jika Anda ingin menggunakan user non-root untuk keamanan tambahan (tidak wajib untuk deployment awal)
# USER springboot