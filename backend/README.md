# Clinic 6 SDA Backend

## Purpose

This backend directory is the foundation for the Clinic 6 SDA Church platform API. It will host server-side business logic, secure data handling, and the API surface used by the public website and future admin portal.

## Relationship with the Public Website

The backend will serve as the authoritative data source for the public React website. The public website will consume backend APIs for donations, campaigns, donor records, project data, reporting, and secure operations.

## Relationship with the Admin Portal

The admin portal will be a separate frontend application that also consumes the backend API. The backend will provide administrative endpoints for managing donors, payments, pledges, budgets, construction progress, materials, volunteers, and media.

## Responsibilities

The backend is responsible for:

- business logic and domain rules
- secure server-side operations
- authorization and RBAC
- payment verification and provider integration
- audit logging and reporting
- safe management of secrets and credentials

## Future Technology

PostgreSQL and Prisma will be introduced later in the backend.

Authentication and RBAC will also be introduced in later tasks.

Payment provider integrations will remain server-side and will not be implemented in this task.

## Secrets and Security

Secrets must never be exposed to frontend source code. The backend will store sensitive configuration and provider secrets in environment variables or secure deployment settings.

## Current Task Status

This task initializes the backend directory and package manifest only.

## Future Task Boundary

Task 2.2 will introduce the Express server skeleton and the `/health` endpoint.
