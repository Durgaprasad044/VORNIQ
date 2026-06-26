# Memory Agent (Agent 7) - API Reference

This document provides a comprehensive list of all endpoints exposed by the Memory Agent.

---

## 1. Store Memory
Stores a new financial memory (metric, document, relationship) for a specific entity.

* **Method**: `POST`
* **URL**: `/api/v1/memory/store`
* **Description**: Validates and stores a new memory record, logging the processing time and assigning a unique UUID.

### Request Headers
* `Content-Type`: `application/json`
* `Authorization`: `Bearer <token>` (If applicable)

### Request Body
```json
{
  "entity_id": "AAPL",
  "memory_type": "metric",
  "metadata": {
    "revenue": 1000,
    "period": "2024-Q1"
  }
}
```

### Success Response
* **HTTP Status Code**: `200 OK`
```json
{
  "success": true,
  "record_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Error Responses
* **HTTP Status Code**: `422 Unprocessable Entity` (Missing required fields)
* **HTTP Status Code**: `500 Internal Server Error` (Database connection failure)

---

## 2. Query Memory
Retrieves memories for a specific entity, with optional filtering by type.

* **Method**: `POST`
* **URL**: `/api/v1/memory/query`
* **Description**: Queries the Memory Repository, returning up to `limit` records matching the criteria, sorted descending by timestamp.

### Request Headers
* `Content-Type`: `application/json`

### Request Body
```json
{
  "entity_id": "AAPL",
  "memory_type": "metric",
  "limit": 10
}
```

### Success Response
* **HTTP Status Code**: `200 OK`
```json
{
  "records": [
    {
      "record_id": "550e8400-e29b-41d4-a716-446655440000",
      "entity_id": "AAPL",
      "memory_type": "metric",
      "timestamp": "2026-06-26T10:00:00Z",
      "metadata": { "revenue": 1000 }
    }
  ]
}
```

### Error Responses
* **HTTP Status Code**: `422 Unprocessable Entity` (Invalid JSON or missing `entity_id`)

---

## 3. Delete Memory
Deletes a specific memory record by its unique identifier.

* **Method**: `DELETE`
* **URL**: `/api/v1/memory/delete`
* **Description**: Removes the specified record from the repository.

### Request Headers
* `Content-Type`: `application/json`

### Request Body
```json
{
  "record_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Success Response
* **HTTP Status Code**: `200 OK`
```json
{
  "success": true
}
```

### Error Responses
* **HTTP Status Code**: `200 OK` (Returns `success: false` if record doesn't exist)
* **HTTP Status Code**: `422 Unprocessable Entity` (Missing `record_id`)

---

## 4. Health Checks
Verifies the operational status of the Memory Agent.

* **Method**: `GET`
* **URLs**: `/api/v1/memory/health`, `/api/v1/memory/ready`, `/api/v1/memory/status`
* **Description**: Simple ping endpoints to ensure the API and database connections are alive.

### Success Response
* **HTTP Status Code**: `200 OK`
```json
{
  "status": "ok",
  "service": "memory_agent",
  "storage_backend": "mock"
}
```
