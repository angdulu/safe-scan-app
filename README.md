# SafeScan (세이프스캔) Core Application 🛡️📱

The core engine of **SafeScan**—a real-time, privacy-first health safety assistant that extracts product ingredients using device vision and translates complex biochemistry into tailored risk summaries.

---

## 🛠️ Technical Highlights & Architecture

SafeScan is architected as a lightweight client-side application designed to optimize vision inference latency for active retail environments. 

### 1. The "Diet" Latency Pipeline
Standard mobile photos are often 3–8 MB, which creates a critical network bottleneck in real-time retail contexts. To resolve this, SafeScan implements a custom **client-side image downscaling pipeline** in `src/services/analyzer.ts`:
- **Dynamic Resizing (`fastResize`):** Downscales images to a maximum dimension of `512px` (maintaining original aspect ratio), which preserves text legibility for small ingredient lists while stripping unnecessary resolution.
- **JPEG Compression Tuning:** Reduces image quality to `0.4` before encoding to Base64, bringing down payloads to **under 100 KB**.
- **Model Efficiency:** Integrates `gemini-flash-lite-latest`, dropping overall network-to-inference roundtrip latency from **30 seconds to under 3 seconds** (a **90% reduction**).

### 2. Structured AI Outputs & Zero-Hallucination Guardrails
To prevent unpredictable generative text formats and maintain complete type safety, the app leverages **Gemini Structured JSON Outputs**:
- Defines a strict schema via the `@google/genai` SDK:
  ```json
  {
    "level": "SAFE" | "CAUTION" | "DANGER",
    "summary": "Core warning in 1-2 sentences",
    "details": "Explanation with scientific authorities",
    "ingredients": ["identified", "substances"]
  }
  ```
- **The Grounding Protocol:** The prompt enforces strict citation requirements, compelling the AI model to justify its warning verdicts with authoritative citations from the **World Health Organization (WHO), Food and Drug Administration (FDA), and Ministry of Food and Drug Safety (MFDS)**.

### 3. Contextual Conversational Memory
SafeScan supports persistent conversation threads. Once a scan is complete, users can ask follow-up questions about specific ingredients. The follow-up pipeline (`askFollowUpQuestion`) aggregates the user's chronic history, the product's structured JSON analysis, and the chat history to provide 3-sentence, context-rich scientific answers.

---

## 💻 Technical Stack

- **Frontend:** React 19 + TypeScript + Vite
- **AI Integration:** `@google/genai` (V3 Google Gen AI SDK)
- **Styling:** Tailwind CSS + Framer Motion (glassmorphic visual tokens)
- **Deployment:** Cloudflare Pages (Static edge hosting)

---

## 🚀 Getting Started (Development Setup)

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API key

### Installation
1. **Clone and enter repository:**
   ```bash
   git clone https://github.com/angdulu/safe-scan-app.git
   cd safe-scan-app
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Launch development server:**
   ```bash
   npm run dev
   ```

---
*Created by Andrew Kim.*
