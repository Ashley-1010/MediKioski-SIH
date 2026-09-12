# MediKiosk — SIH Market-Ready Prototype

MediKiosk is an AI-assisted patient case-taking and clinical record management system based on the supplied PRD and the supplied React/Vite frontend.

## What is preserved

The original visual frontend components, styling, animation system and component structure are retained. Backend integration is added through `src/services/api.js` and an API-aware Zustand store. Reception and Doctor dashboards keep the same visual presentation and can fall back to demo data if the API is unavailable.

## Architecture

```text
React + Vite
     │
     ├── Patient registration
     ├── Reception dashboard
     └── Doctor dashboard
              │
              ▼
          FastAPI REST API
              │
       ┌──────┼─────────┐
       ▼      ▼         ▼
   SQLite/  File      AI draft
 PostgreSQL storage   summarizer
```

## Local run — Windows / VS Code

### 1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### 2. Frontend

Open a second terminal:

```powershell
npm install
npm run dev
```

Frontend: `http://localhost:5173`

The Vite development server proxies `/api` to the FastAPI backend.

## Single-service deployment

The included Dockerfile builds the React frontend and then serves the built application from FastAPI.

```bash
docker build -t medikiosk .
docker run -p 8000:8000 -e JWT_SECRET="replace-me" medikiosk
```

Open `http://localhost:8000`.

This can be deployed to any Docker-capable cloud platform. `render.yaml` is included as a starting point for Render.

## Demo accounts

Only when `DEMO_MODE=true`:

- Doctor: `doctor@medikiosk.demo` / `DemoDoctor@123`
- Receptionist: `reception@medikiosk.demo` / `DemoReception@123`

The frontend automatically requests a short-lived demo JWT for the dashboard role. For a real deployment, disable demo login and add a proper login screen/identity provider.

## Important production notes

1. Use PostgreSQL instead of SQLite for multi-instance production.
2. Use S3-compatible object storage instead of local disk for medical documents.
3. Use HTTPS and a managed secrets store.
4. Replace demo authentication with a real identity provider and MFA.
5. Add database migrations (Alembic) before production schema changes.
6. Add a production OCR provider/worker and a vetted LLM provider if AI summarization is enabled.
7. Do not expose uploaded medical files as public static assets.
8. Review applicable Indian privacy, healthcare and data-retention requirements before handling real patient data.
9. AI output is documentation assistance only and must be reviewed and approved by a qualified doctor.

## Main API

- `POST /api/auth/login`
- `POST /api/auth/demo-login`
- `POST /api/registrations`
- `GET /api/registrations/{registration_id}`
- `POST /api/registrations/{registration_id}/check-in`
- `GET /api/encounters/today`
- `GET /api/encounters/{encounter_id}/record`
- `PUT /api/encounters/{encounter_id}/status`
- `GET /api/doctor/patients/today`
- `POST /api/documents/upload`
- `GET /api/documents/{encounter_id}`
- `GET /api/documents/file/{document_id}`
- `POST /api/summary/generate`
- `GET /api/summary/{encounter_id}`
- `PUT /api/summary/{summary_id}`
- `PUT /api/summary/{summary_id}/approve`
- `GET /api/health`

## Database

The API creates these core entities:

- users
- patients
- encounters
- registration_sequences
- clinical_history
- ayurveda_assessment
- medical_documents
- clinical_summaries
- audit_logs

Registration IDs use the PRD format:

`REG-YYYY-MM-DD-SEQUENCE`

Patient IDs use:

`PAT-00000000`

## SIH demo flow

1. Scroll/use Patient Registration.
2. Complete all six steps.
3. Submit.
4. Show generated Patient ID + Registration ID.
5. Open Reception Control Center.
6. Search/check in the patient.
7. Open Doctor Dashboard.
8. Select the encounter.
9. Generate the AI documentation draft.
10. Explain that the doctor reviews/edits/approves the AI output.

