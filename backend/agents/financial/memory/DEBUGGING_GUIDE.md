# Memory Agent (Agent 7) - Debugging Guide

If a request fails, follow this guide to identify and fix the issue.

## 1. Validation Failures (HTTP 422)
* **Possible Cause**: The request body is missing required fields (e.g. `entity_id` or `memory_type`) or contains malformed JSON.
* **Where to Check**: Review the FastAPI error response body which details exactly which field failed Pydantic validation.
* **Fix**: Refer to `API_REFERENCE.md` or `test_data.json` for the correct payload structure.

## 2. Server Errors (HTTP 500)
* **Possible Cause**: The `MemoryRepository` failed to save to the database (e.g. Hindsight connection timeout).
* **Where to Check**: 
  - Application Logs (stdout/stderr).
  - Configuration variables in `config.py`.
* **Fix**: Check your `POSTMAN_ENVIRONMENT.json` variables. Ensure `hindsight_api_key` and `hindsight_endpoint` are properly set if not using the `mock` backend.

## 3. Empty Responses on Query (HTTP 200, but `[]`)
* **Possible Cause**: The `entity_id` does not exist, or the `memory_type` filter is too strict.
* **Where to Check**: Check the database records or your previous `/store` requests to ensure the entity ID matches exactly (case-sensitive).
* **Fix**: Send a query without the `memory_type` parameter to see all records for that entity.

## 4. Environment Variables
Ensure the following variables are available in `.env`:
```env
MEMORY_STORAGE_BACKEND=mock
HINDSIGHT_API_KEY=your_key_here
```
If the backend is switched to `hindsight` without an API key, the Dependency Injection container will fail on startup.
