# Memory Agent (Agent 7)

## Purpose
Agent 7 acts as the long-term storage engine for VORNIQ, allowing previous states, metrics, and relationships to be securely persisted and queried.

## Architecture
This implementation provides the architectural scaffolding using the Dependency Inversion Principle. No business logic relies directly on the database implementation.

### Abstractions
- **Storage Interfaces**: Defined in `base_repository.py`.
- **Service Interfaces**: Defined in `base_service.py`.

### Implementations
- **Mock Integration**: Currently uses an in-memory Mock dictionary via `dependencies.py` injection so the platform APIs can be tested without persistence.
- **Hindsight Integration**: Pending. Hindsight will simply implement the `MemoryRepository` interface when deployed.

## API Usage
```http
POST /api/v1/memory/store
POST /api/v1/memory/query
```
