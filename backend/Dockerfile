# Estágio de Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Variável de ambiente para a porta (padrão 8080 se não fornecida)
ENV PORT=8080

# Expõe a porta
EXPOSE ${PORT}

# Comando para iniciar a aplicação
# O -Dserver.port=${PORT} garante que o Spring use a porta definida pelo Railway
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
