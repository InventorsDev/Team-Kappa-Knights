# Backend Development Contribution Guidelines

Welcome to the NeurolOom backend repositories! This document outlines the shared code standards and API documentation style for both the FastAPI and Django backend teams to ensure consistency and smooth collaboration.

## Code Standards

- Follow Python’s [PEP8](https://peps.python.org/pep-0008/) style guide.
- Use **`black`** for auto-formatting all code.
- Use **`isort`** to organize imports consistently.
- Use linters such as **`flake8`** or **`ruff`** to catch style and syntax issues.
- Use **type annotations** throughout the codebases for clarity and better editor support.
- Follow consistent **naming conventions**:
  - `snake_case` for variables, functions, and methods.
  - `CamelCase` for class and model names.
- Separate code logically into:
  - `models/` for ORM models
  - `schemas/` or `serializers/` for data validation models
  - `api/` or `views/` for endpoint definitions or routers
  - `services/` for business logic (especially in FastAPI)
- Centralize configurations in environment variables or config files, avoiding hardcoding secrets.

## API Documentation

- Use **OpenAPI/Swagger** standards for API contracts:
  - FastAPI automatically provides `/docs` and `/redoc`.
  - Django REST Framework uses tools like `drf-yasg` or `drf-spectacular`.
- Document every endpoint with:
  - A clear **summary** and **description**.
  - Proper **tags** for grouping (e.g., `users`, `progress`, `courses`).
  - Request and response models with examples.
- Use **versioned API paths**, for example, prefix all routes with `/api/v1/`.
- Clearly document authentication and permission requirements on each endpoint.

## Database & Analytics Schema Guidelines

- Agree on a **shared database schema** documented and version-controlled.
- For analytics and business logic layers (especially in Django):
  - Use explicit and well-named ORM models tied closely to the shared tables.
  - Document relationships and constraints clearly.
  - Comment complex queries and aggregation logic thoroughly.
  - Maintain schema changes with migrations carefully coordinated between teams.
- Define denormalized tables or materialized views if needed for performance and batch jobs.
- Share and version schema documentation in `db/schema.md` or an equivalent shared doc.

## Workflow & Code Review

- All code changes must be submitted via pull requests (PRs).
- Every PR requires review and approval by at least one other backend team member.
- Ensure all tests pass and code formatting checks run before merging.
- Run formatters and linters via pre-commit hooks (`black`, `isort`, `flake8`).

## Additional Notes

- Coordinate API contract changes before implementation.
- Share any schema changes in team meetings or documentation channels.
- Keep API backward compatibility in mind when deploying changes.

Thank you for your contributions!

---
