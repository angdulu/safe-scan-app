# SafeScan (세이프스캔) 🛡️

**AI-powered personal health safety assistant** that analyzes products based on your specific health profile.

## 🌟 Overview
SafeScan helps individuals with specific health conditions (diabetes, allergies, etc.) quickly determine if a product (food, medicine, cosmetics) is safe for them. By simply scanning a label or typing a name, users get an instant risk assessment tailored to their medical history.

## 🚀 Key Features
- **Smart Profiling:** Custom health setup to tailor AI analysis to your specific needs.
- **Visual Scanner:** A polished "scanning" interface that analyzes product labels in real-time.
- **Flash-Speed Analysis:** Optimized image processing and lightweight model usage (Gemini Flash Lite) for sub-5 second responses.
- **AI Health Chat:** Persistent chat history to ask follow-up questions about ingredients with authoritative references (WHO, MFDS).
- **Privacy Centric:** Clear transparency on data usage and legal consensus.

## 🛠️ Tech Stack
- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS + Framer Motion (for fluid animations)
- **AI Core:** Google Gemini API (Multimodal Vision & Chat)
- **Icons:** Lucide React

## 🧠 Project Philosophy
> "Safety isn't a one-size-fits-all labels."

SafeScan focuses on **contextual safety**. We believe that information should be accessible, lightning-fast for retail environments, and backed by a conversational depth that builds trust.

## 📈 Evolution & Shifts
- **The Speed Pivot:** Migrated from high-res image buffers to client-side resizing and `flash-lite` models to reduce analysis time from 30 seconds to under 5 seconds.
- **Conversation Persistence:** Evolved the "Ask a Question" feature into a full Chat interface with context-aware history.
- **Trust & Compliance:** Integrated clear legal disclaimers and privacy-first UI patterns to ensure users are informed about the AI's role.

---
*Note: This application is an AI-driven analysis tool and should not be used as a substitute for professional medical advice.*
