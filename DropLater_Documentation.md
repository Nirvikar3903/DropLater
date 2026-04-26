# 📦 DropLater  
### Project Documentation & Architecture Deep Dive

A reliable, delay-based note delivery system built using a **Producer–Consumer architecture**.

---

## 🏗️ 1. System Architecture

DropLater follows a **decoupled, event-driven design**:
User → API (Producer) → Redis Queue → Worker (Consumer) → Sink (Receiver)
↓
MongoDB

### 🔁 Flow Summary
- **API** schedules jobs  
- **Redis (BullMQ)** manages delayed execution  
- **Worker** processes jobs  
- **Sink** receives delivery  
- **MongoDB** stores persistent state  

---

## 🧩 2. Services Overview

| Service     | Role               | Description                                                  | Tech Stack                |
|-------------|--------------------|--------------------------------------------------------------|---------------------------|
| **API**     | Producer           | Accepts notes, validates input, schedules delivery           | Express, Mongoose, BullMQ |
| **Worker**  | Consumer           | Executes jobs, retries failures, updates delivery status     | BullMQ, Axios             |
| **Sink**    | Receiver (Mock)    | Accepts webhook deliveries, ensures idempotency              | Express, ioredis          |
| **Redis**   | Message Broker     | Handles queues, delays, retries                              | Redis Stack               |
| **MongoDB** | Persistent Storage | Stores notes, status, and delivery history                   | MongoDB                   |

---

## 🌐 3. API Contracts

### 📌 API Service (`/api/notes`)
**Base URL:** `http://localhost:3000`

| Method | Endpoint                | Description                   | Example Payload |
|--------|-------------------------|-------------------------------|-----------------|
| GET    | `/health`               | Health check                  | `{ "ok": true }` |
| POST   | `/api/notes`            | Create & schedule note        | `{ "title": "...", "body": "...", "releaseAt": "ISO_DATE" }` |
| GET    | `/api/notes?status=`    | Fetch notes (optional filter) | — |
| POST   | `/api/notes/:id/replay` | Retry failed/dead note        | — |

---

### 📌 Sink Service (`/sink`)
**Base URL:** `http://localhost:4000`

| Method | Endpoint | Description               | Header Required     |
|--------|----------|---------------------------|---------------------|
| GET    | `/health`| Health check              | — |
| POST   | `/sink`  | Receive delivered payload | `X-Idempotency-Key` |

---

## 🔄 4. Note Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant API
    participant Redis
    participant Worker
    participant Sink
    participant DB

    User->>API: Create Note (releaseAt)
    API->>DB: Save (status: pending)
    API->>Redis: Add delayed job
    Redis-->>Worker: Job ready
    Worker->>Sink: POST note
    Sink-->>Worker: 200 OK
    Worker->>DB: Update (delivered)



    🪜 Step-by-Step
User submits a note with releaseAt
API stores note in MongoDB (pending)
Job scheduled in Redis using BullMQ
Worker picks job when delay expires
Worker sends note to Sink
Sink responds with 200 OK
Worker updates status to delivered


🛡️ 5. Reliability Features
🔑 Idempotency (No Duplicate Delivery)
Each note has a unique idempotencyKey
Sink checks Redis before processing requests

Result:

Prevents duplicate deliveries
Ensures safe retries

⏱️ Exponential Backoff (Retry Strategy)| Attempt | Delay      |
| ------- | ---------- |
| 1       | Immediate  |
| 2       | 1 second   |
| 3       | 5 seconds  |
| 4       | 25 seconds |

Purpose: Avoid overwhelming downstream services

💀 Dead Letter Handling
After maximum retry attempts → status becomes dead
Stored for debugging and analysis
Can be manually retried using replay endpoint

🗄️ 6. Database Schema (MongoDB)
| Field            | Type   | Description                              |
| ---------------- | ------ | ---------------------------------------- |
| `title`          | String | Note title                               |
| `body`           | String | Note content                             |
| `status`         | Enum   | `pending`, `delivered`, `failed`, `dead` |
| `releaseAt`      | Date   | Scheduled delivery time                  |
| `attempts`       | Array  | Retry logs (status, error, timestamp)    |
| `idempotencyKey` | String | Prevents duplicate processing            |

📊 7. Observability Guide
🔍 View Logs
docker compose logs -f
🧪 Test the System
Create a note with a 30-second delay
Watch Worker logs for execution
Confirm Sink receives the payload
Verify MongoDB status update
✨ 8. Suggested Enhancements
📈 Add queue dashboard (Bull Board)
🔔 Notifications for failed/dead jobs
🔐 Authentication & authorization
📦 Custom retry policies per user
📊 Metrics with Prometheus + Grafana
🧾 9. Export to PDF
Option 1: VS Code
Install Markdown PDF extension
Right-click → Export as PDF
Option 2: CLI
npx @marp-team/marp-cli DropLater_Documentation.md -o DropLater.