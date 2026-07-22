# 🚨 AI Disaster Emergency Portal (Unified Next.js 15 SIH 2026 Edition)

An ultra-modern, production-ready National Emergency Management & Response Coordination Platform for Citizens, Volunteers, District Officers, NGOs, and Super Admins built with **Next.js 15 (App Router)** and **Serverless API Routes**.

---

## 🌟 Key Capabilities & Features

### 1. 🤖 Serverless Gemini AI Integration
- **SOS Severity Triage**: Predicts urgency & assigns severity (1–10 scale) automatically via `/api/ai/analyze-sos`.
- **Rescue Team Dispatch**: Recommends appropriate response units (e.g., NDRF Amphibious Battalion, Fire Hazmat, Paramedic ICU).
- **AIDA Emergency Chatbot**: Natural language 24/7 survival guidance, first aid instructions, and shelter recommendations via `/api/ai/chat`.
- **Multilingual Support**: Real-time translation into Hindi, Tamil, Bengali, Marathi, and English.
- **Predictive Resource Allocation**: AI calculates required food, clean water, blankets, and medicine based on affected population.

### 2. 🗺️ Live GIS Disaster Mapping
- Leaflet / OpenStreetMap layers for **Live SOS Alerts**, **Relief Shelters**, **Volunteer Positions**, and **Radar Safe Zones**.

### 3. 👥 5-Role Dedicated Workspaces
- **Citizen**: Submit Emergency SOS with GPS auto-detection, view family safe status, locate nearest relief centers.
- **Volunteer**: View verified badge, complete nearby rescue missions, record mission check-in, download official digital volunteering certificates.
- **District Officer**: Triage live emergency feeds, dispatch NDRF/Fire units, verify volunteer applications, monitor shelter capacities, export incident reports.
- **NGO Partner**: Manage food, medicine, blanket, and vehicle inventories; track community donations.
- **Super Admin**: Dispatch mass broadcast alerts via SMS/Push/Email, review system audit logs, configure disaster categories.

---

## 🚀 1-Click Vercel Deployment

1. Push this repository to GitHub/GitLab.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Select your repository.
4. Add Environment Variable:
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key.
5. Click **Deploy**!

---

## ⚡ Local Development Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run local Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
Developed for **Smart India Hackathon (SIH 2026)**. Licensed under the MIT License.
