# Ervie - Anxiety Support Companion

![Ervie Banner](https://placehold.co/1200x400/867707/ffffff?text=Ervie:+Your+Calm+in+the+Chaos)

**Ervie** is a fully functional conversational chatbot application designed to provide immediate support for anxiety. It features a dual-mode interaction system allowing users to connect via standard text chat or a real-time, low-latency voice agent powered by Google's Gemini Multimodal Live API.

> **Note:** This application is a supportive companion and is **not** a replacement for professional medical advice, diagnosis, or treatment.

## ✨ Features

- **🎙️ Real-time Voice Agent**  
  Experience natural, fluid conversations with Ervie using the Gemini Live API. The voice agent supports interruption, emotional nuance, and real-time audio visualization.

- **💬 Text Chat Companion**  
  A classic chat interface for silent support. Ervie helps ground you with breathing exercises and calm conversation.

- **ca. Real-time Analytics**  
  Visualizes the conversation in real-time to provide insights into emotional states.
  - **Sentiment Flow:** Tracks the emotional trajectory of the session.
  - **Emotion Distribution:** Break down of user feelings (Calm, Anxious, Hopeful, Neutral).
  - **Anxiety Estimator:** Heuristic analysis of language patterns.

- **🎨 Modern UI/UX**  
  Built with a soothing, accessible color palette using `oklch` color spaces and Tailwind CSS. Fully responsive for desktop and mobile.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS
- **AI Integration:** Google GenAI SDK (`@google/genai`)
- **Models:** 
  - Text: `gemini-2.5-flash`
  - Voice: `gemini-2.5-flash-native-audio-preview-09-2025`
- **Audio:** Native Web Audio API (PCM Encoding/Decoding)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Google AI Studio API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YoRzHe-HotaaRu/evie-v1.git
   cd ervie-anxiety-support
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   API_KEY=your_google_ai_studio_api_key_here
   ```
   *(Note: If using a bundler like Vite, you may need to prefix this with `VITE_` depending on your setup, or use the `define` plugin).*

4. **Run the Application**
   ```bash
   npm run dev
   ```

## 🧠 How It Works

1. **Voice Processing:**  
   The app captures microphone input, converts it to 16kHz PCM audio, and streams it via WebSocket to the Gemini Live API.
   
2. **Live Response:**  
   Gemini returns raw PCM audio chunks which are decoded and played back instantly using the Web Audio API, creating a near-zero latency conversation.

3. **Sentiment Analysis:**  
   The app analyzes user keywords locally in real-time to generate dynamic charts on the Analytics tab, offering immediate feedback on the session's effectiveness.

## 👤 Author

**Amir Hafizi**  
*Hobbyist Developer & Bachelor of Computer Science Student*  
*Universiti Teknologi MARA (UiTM) Tapah, Perak, Malaysia*

- 🌐 **Website:** [yiorzhe.dev](https://yiorzhe.dev)
- 🐙 **GitHub:** [YoRzHe-HotaaRu](https://github.com/YoRzHe-HotaaRu)
- 💼 **LinkedIn:** [Amir Hafizi Musa](https://linkedin.com/in/amir-hafizi-musa-5530b9364)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
