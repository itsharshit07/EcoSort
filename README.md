# ♻️ EcoSort AI

EcoSort AI is a smart e-waste management web application that helps users report, classify, and responsibly dispose of electronic waste using AI-powered detection and location-based pickup coordination.

---

## 🌟 Features

- 🔐 **Email-based Firebase Authentication**
- 📍 **Waste Reporting with Geo-Location**
- 🧠 **AI-Powered Waste Type Detection (via Vertex AI)**
- ✅ **Pickup Confirmation Workflow**
- 🏆 **Reward Points System**
  - +20 for reporting waste
  - +20 for verified pickups
- 🔒 **Role-based Access Control** for pickup verification
- 🔥 Hosted on Firebase Hosting + Cloud Run (FastAPI backend)

---

## 🧑‍💻 Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) (with TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Auth](https://firebase.google.com/products/auth)

### Backend
- [FastAPI](https://fastapi.tiangolo.com/)
- [Google Firestore](https://firebase.google.com/products/firestore)
- [Vertex AI](https://cloud.google.com/vertex-ai) (for waste classification)

### Deployment
- Firebase Hosting (Frontend)
- Cloud Run (Backend + AI model)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ecosort-ai.git
cd ecosort-ai
