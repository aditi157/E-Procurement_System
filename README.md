# Enterprise Procurement Management System

A role-based web application designed to digitally manage organizational procurement workflows including purchase requests, approvals, vendor selection, auctions, orders, and payments.

---

## Project Overview

The Enterprise Procurement Management System is a web-based application that models how organizations handle internal procurement processes in a structured and transparent manner.  

The system supports multiple user roles such as Employees, Managers, Vendors, and Finance users, each with clearly defined responsibilities and access controls.

This project is currently implemented as a **frontend prototype**, with backend and database layers planned for future phases.

---

## Problem Statement

In many organizations, procurement processes are manual, fragmented, and lack transparency.  
This often results in delays, poor tracking of requests, inefficient vendor selection, and payment issues.

This system aims to:
- Digitize the procurement lifecycle
- Improve traceability and accountability
- Enable structured approvals and vendor interactions
- Provide visibility across all stakeholders

---

## Target Users (Personas)

### Employee
- Creates purchase requests
- Tracks request status

### Manager
- Reviews and approves requests
- Creates orders or auctions
- Assigns vendors

### Vendor
- Participates in auctions
- Fulfills assigned orders
- Submits invoices

### Finance
- Reviews invoices
- Marks payments as completed

---

## Vision Statement

To provide a scalable, role-based digital procurement system that improves efficiency, transparency, and control over organizational purchasing workflows.

---

## Key Features and Goals

- Role-based dashboards
- Purchase request creation and tracking
- Approval workflow management
- Auction-based vendor selection
- Order lifecycle management
- Invoice verification and payment tracking
- Scalable architecture for future backend integration

---

## Success Metrics

- Reduction in manual procurement steps
- Clear visibility of request and order status
- Structured vendor selection process
- Improved auditability of procurement activities

---

## Assumptions and Constraints

### Assumptions
- Users have role-based access
- Backend and database will be added in later phases

### Constraints
- Frontend-only implementation for current phase
- LocalStorage used as a mock database
- No real payment processing

---

## Architecture Overview

The system follows a layered architecture:

- **Frontend:** React + Vite
- **Backend (Planned):** Node.js + Express
- **Database (Planned):** MySQL
- **Cache (Optional):** Redis
- **Authentication:** JWT-based role access
- **Deployment:** Dockerized containers on cloud/VM

The architecture diagram is included in the `docs/` folder.

---

## Repository Structure

```text
frontend/
  ├── src/
  │   ├── pages/
  │   ├── services/
  │   ├── data/
  │   ├── components/
  │   ├── utils/
  │   └── App.jsx
  ├── Dockerfile
  └── package.json

backend/
  ├── src/
  │   ├── routes/
  │   ├── controllers/
  │   ├── services/
  │   ├── models/
  │   └── config/
  └── Dockerfile

docs/
  ├── architecture-diagram.png
  └── wireframes/
