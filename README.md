# 🌍 Detektif Sampah (Eco Detective) - KKN Game Project

<div align="center">
  <img src="./src/assets/backgrounds/coverfix.png" alt="Detektif Sampah Cover" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" />
</div>

<br />

<div align="center">
  <strong>An interactive, educational web-based game designed to teach children about environmental awareness and waste management.</strong>
</div>
<br />

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Phaser-000000?style=for-the-badge&logo=phaser&logoColor=white" alt="Phaser" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</div>

---

## 📖 About the Project

**Detektif Sampah** (Eco Detective) is a specialized educational game created as part of a **KKN (Kuliah Kerja Nyata)** initiative. The game aims to build environmental awareness among students through engaging, interactive storytelling.

Players step into the shoes of a "Garbage Detective" to investigate polluted areas, solve environmental cases (like cleaning up dirty yards and clogged sewers), and learn how to properly categorize and manage waste. By combining an interactive web portal with a dedicated 2D game engine, it provides a seamless and fun learning experience.

## ✨ Key Features

- 🕵️‍♂️ **Interactive Detective Gameplay**: Built with **Phaser**, players explore scenes, interact with objects, and solve pollution cases.
- 📚 **Educational Modules**: Dedicated learning sections (`/edukasi`) that provide supplementary material about waste management.
- 🏆 **Global Leaderboard**: Integrated with **Supabase**, allowing players to compete for the highest score as the ultimate eco-detective.
- 👩‍🏫 **Teacher & Progress Dashboard**: Track student progress and view detailed statistics (`/guru` & `/progres`).
- ⚡ **Seamless React Integration**: The game runs smoothly inside a modern React application, offering full-screen modes and responsive UI.
- 🎵 **Immersive Audio & Visuals**: Features custom characters, dynamic typing dialogues, transitions, and engaging sound effects.

---

## 🖼️ Sneak Peek

<div align="center">
  <img src="./src/assets/backgrounds/intro.png" width="48%" alt="Intro Scene" style="border-radius: 8px;" />
  <img src="./src/assets/backgrounds/papan-kasus.png" width="48%" alt="Case Board" style="border-radius: 8px;" />
</div>
<br/>
<div align="center">
  <img src="./src/assets/backgrounds/selokan.png" width="48%" alt="Sewer Investigation" style="border-radius: 8px;" />
  <img src="./src/assets/backgrounds/halaman-kotor.png" width="48%" alt="Dirty Yard" style="border-radius: 8px;" />
</div>

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 19](https://react.dev/)
- **Game Engine**: [Phaser](https://phaser.io/)
- **Routing**: React Router DOM v7
- **Styling & Icons**: Vanilla CSS & [Lucide React](https://lucide.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript

---

## 📂 Project Structure

```text
kkn-game/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Game assets (backgrounds, audio, characters)
│   ├── components/         # Reusable React UI components (Layout, Navbar, etc.)
│   ├── game/               # Phaser Game Logic
│   │   └── scenes/         # Game Scenes (Intro, Investigation, Cleanup, Solution)
│   ├── lib/                # Libraries and API clients (Supabase client)
│   ├── pages/              # React Routes (Home, Learn, Teacher, Progress, About)
│   ├── App.tsx             # Main Application Router
│   └── main.tsx            # React Entry Point
└── package.json            # Dependencies and scripts
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <your-repository-url>
   cd kkn-game
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the App**:
   Navigate to `http://localhost:5173` in your browser.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles TypeScript and builds the app for production.
- `npm run preview`: Bootstraps a local server to preview the production build.
- `npm run lint`: Runs Oxlint to analyze code quality.

---

## 🤝 Contributing

This project is part of a university KKN program. If you are part of the team and wish to contribute:

1. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
2. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the Branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

<div align="center">
  Made with ❤️ for a cleaner and greener future! 🌱
</div>
