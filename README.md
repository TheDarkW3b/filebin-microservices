# 📁 FileBin — Secure File & Paste Storage Platform

> _One platform to store files, pastes, and monitor everything in real time._

![FileBin Banner](./assets/banner.png)

---

## 🚀 Features

- 🔐 **JWT Authentication** with user registration and login
- 📤 **File Uploading** and secure storage
- 📝 **Pastebin-like sharing** of text content
- 📧 **Email Notifications** via Kafka
- 📡 **Service Discovery** with Eureka
- 🌐 **API Gateway** for unified access
- 📈 **Distributed Tracing** with Jaeger
- 📊 **Monitoring & Logs** using Prometheus, Loki, and Promtail
- 📉 **Grafana dashboards and anomaly detection** (🛠️ *Coming Soon*)

---

## 🧰 Tech Stack

| Category               | Technologies                                                                 |
|------------------------|-------------------------------------------------------------------------------|
| **Backend**            | Java, Spring Boot, Spring Cloud, Spring Security                             |
| **Frontend**           | React.js, Tailwind CSS                                                        |
| **Inter-Service Comm** | Eureka (Service Discovery), Spring Cloud Gateway                             |
| **Messaging**          | Apache Kafka                                                                 |
| **Tracing & Logs**     | Jaeger (Tracing), Loki + Promtail (Logging)                                  |
| **Monitoring**         | Prometheus + Grafana                                                         |
| **Database**           | MongoDB                                                                      |
| **Containerization**   | Docker, Docker Compose                                                        |

---

## 📦 Microservices Overview

- `discovery-server`: Eureka service registry
- `api-gateway`: Central API gateway using Spring Cloud Gateway
- `user-service`: Manages user registration, authentication, and user-favourites
- `file-service`: Handles file uploads/downloads
- `paste-service`: Pastebin-style text sharing
- `notification-service`: Kafka consumer that sends email notifications
- `filebin-frontend`: React-based frontend UI
- Monitoring stack: `prometheus`, `jaeger`, `loki`, `promtail`, `grafana (coming soon)`

---

## 🛠️ Local Setup Guide

> Ensure **Docker**, **Docker Compose**, **Java 17+ (21 Preferred)**, and **Maven** are installed.

### 1. Clone the Repository
```bash
git clone https://github.com/thedarkw3b/filebin-microservices
cd filebin-microservices
```

### 2. Build All Spring Boot Services
Build each service with Maven:
```bash
mvn clean package -DskipTests
```

### 3. Build and Run with Docker Compose
```bash
docker-compose build
docker-compose up
```

---

## 📡 Service URLs

| Service                 | URL                      |
|-------------------------|---------------------------|
| React Frontend (WebApp) | http://localhost:3000     |
| API Gateway             | http://localhost:8080     |
| Eureka Discovery        | http://localhost:8761     |
| Jaeger UI               | http://localhost:16686    |
| Prometheus              | http://localhost:9090     |
| Loki (Logs API)         | http://localhost:3100     |
| Grafana                 | http://localhost:3001 *(coming soon)* |

---

## 🔍 Monitoring & Observability

| Tool        | Purpose                        |
|-------------|--------------------------------|
| **Prometheus** | Scrapes and stores metrics |
| **Jaeger**     | Distributed tracing for microservices |
| **Loki**       | Aggregates logs |
| **Promtail**   | Sends Docker logs to Loki |
| **Grafana**    | Unified dashboards *(coming soon)* |

---

## 🙌 Contribution

Feel free to open issues or submit PRs. Contributions that enhance observability and security are especially welcome!

---

