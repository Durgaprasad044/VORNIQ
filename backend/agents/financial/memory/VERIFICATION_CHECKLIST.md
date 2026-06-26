# Memory Agent (Agent 7) - Verification Checklist

Use this checklist to manually verify the Memory Agent functionalities during deployment or after updates.

## 1. API Verification
- [ ] **API responds**: Attempt to `GET /api/v1/memory/health`. It must return `200 OK`.
- [ ] **Validation works**: Submit a POST request to `/store` missing the `entity_id`. It must return `422 Unprocessable Entity`.
- [ ] **Errors returned correctly**: Try deleting an invalid `record_id`. It must return `{ "success": false }` without crashing.

## 2. Business Logic Verification
- [ ] **Logging works**: Check the console output when storing a memory to ensure the request is logged.
- [ ] **Response schema correct**: Store a memory and verify the response strictly matches `{ "success": true, "record_id": "<uuid>" }`.
- [ ] **Processing time logged**: Verify that the execution time of the request is recorded in the agent metrics (if applicable).

## 3. Storage Verification
- [ ] **Database updated**: The mock (or Hindsight) repository successfully accepts the `save()` method.
- [ ] **Memory stored**: Retrieve the memory immediately after storing to prove persistence.
- [ ] **Memory deleted**: Retrieve the memory after a deletion request to prove it was successfully expunged.
