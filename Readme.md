# ⚡ Smart Grid Load Balancing & Forecasting API

## Overview

The Smart Grid Load Balancing & Forecasting API is a high-performance backend system designed for modern energy utilities. It collects continuous smart meter telemetry, stores time-series data, performs background load analysis, and generates real-time grid alerts.

This project is developed as part of the Infotact Advanced Python Engineering Internship.

---

# Problem Statement

Renewable energy sources such as solar and wind are highly dynamic.

To avoid power outages, utility companies must continuously monitor power consumption and calculate grid load distribution.

This project provides a scalable backend capable of

- High-speed telemetry ingestion
- Real-time load balancing
- Background data aggregation
- WebSocket alerts
- Historical analytics

---

# Features

✔ FastAPI REST APIs

✔ High Throughput Data Ingestion

✔ TimescaleDB Time-Series Storage

✔ Celery Background Workers

✔ Redis Task Queue

✔ Real-Time WebSocket Alerts

✔ Docker Deployment

✔ Swagger Documentation

---

# Tech Stack

Backend

- Python
- FastAPI

Database

- PostgreSQL
- TimescaleDB

Background Processing

- Celery
- Redis

Deployment

- Docker
- Docker Compose

Testing

- Pytest

CI/CD

- GitHub Actions

---

# Project Architecture

Smart Meter

↓

FastAPI API

↓

TimescaleDB

↓

Celery Worker

↓

Load Analysis

↓

Redis Queue

↓

WebSocket Alert

↓

Dashboard

---

# API Endpoints

POST /meters

Submit Smart Meter Data

GET /meters

View Meter Readings

GET /zones/load

Current Zone Load

GET /analytics

Historical Analytics

WebSocket

/ws/alerts

Real-time Grid Alerts

---

# Week-wise Development Plan

## Week 1

- FastAPI Setup
- PostgreSQL
- TimescaleDB
- Database Models
- Ingestion API

## Week 2

- Redis
- Celery
- Aggregation Jobs
- Zone Load Calculation

## Week 3

- WebSocket
- Threshold Detection
- Real-time Alerts

## Week 4

- Docker
- Optimization
- Testing
- Documentation
- Swagger

---

# Installation

Clone Repository

git clone <repo-url>

Create Virtual Environment

python -m venv venv

Activate

Windows

venv\Scripts\activate

Linux

source venv/bin/activate

Install

pip install -r requirements.txt

Run

uvicorn app.main:app --reload

---

# Docker

docker-compose up --build

---

# Contributors

- Member 1 – Backend API
- Member 2 – Database & Background Workers
- Member 3 – WebSocket, Docker & Documentation

---

# License

MIT License
