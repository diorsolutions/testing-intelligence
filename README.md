# DOCX Test Wizard

A modern Next.js 15 application designed to parse structured assessment questions from Microsoft Word (.docx) documents and present them through an interactive, multi-step testing interface.

---

## Features

- **Automated Document Parsing** – Direct extraction of tabular questionnaire data using Mammoth.js, eliminating manual data entry.
- **Dynamic Wizard Interface** – Step-by-step evaluation workflow optimized for user engagement and response retention.
- **Relational Data Persistence** – Real-time tracking and analytics powered by Neon Postgres with localized session handling.
- **Production-Ready Deployment** – Seamless integration with Vercel environments using optimized build pipelines.

---

## Technical Stack

| Framework / Library | Role in Architecture |
| :--- | :--- |
| **Next.js 15 (App Router)** | Core architecture, server component optimization, and API routing. |
| **TypeScript** | Strict type-safety across data parsing models and UI states. |
| **Tailwind CSS** | Declarative utility-first styling for modular UI components. |
| **Mammoth.js** | Low-level HTML conversion for structured Word processing. |
| **Neon Postgres** | Serverless PostgreSQL database layer with connection pooling. |

---

## Installation and Setup

### 1. Database Provisioning
1. Authenticate into your dashboard at [Neon.tech](https://neon.tech) and initialize a new PostgreSQL project.
2. Extract the connection string from the database dashboard.
3. Generate a `.env.local` file in the root directory of your project and append the environment variable:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
