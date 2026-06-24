<p align="center">
<img src="https://i.ibb.co/0RtJb89c/64x64.png" alt="Sonara">
</p>
<h1 align="center">Sonara</h1>
<p align="center">
  A sleek, lightweight desktop music player built with <b>Tauri + React</b>.<br/>
  Designed for fast local playback, beautiful UI, and a distraction-free listening experience.
</p>

<br/>

## ✨ Experience Music the Way It Should Be

Sonara is built for focus and simplicity. No clutter. No noise. Just your music, beautifully organized and instantly accessible.

<br/>

## 🎧 Key Features

### 🎵 Pure Local Playback
Instantly scan and play music from your local folders with zero setup.

### 🎶 Smart Playlists
Create and manage playlists effortlessly with a clean, intuitive interface.

### 📝 Synced Lyrics Support
Supports `.lrc` files with timestamp-based lyric synchronization.

### ⚡ Lightweight Performance
Built with Tauri for near-native performance and minimal resource usage.


<br/>

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Desktop Runtime:** Tauri (Rust backend)
- **Styling and UI:** Tailwind CSS / ShadCN UI
- **Database and Storage:** SQLite and local storage
- **Audio Engine:** Native system audio / HTML5 Audio API

<br/>

## 📦 Installation
### Prerequisites

Make sure you have installed:

- Node.js
- pnpm (recommended)
- Rust (for Tauri)
- Tauri system dependencies

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/sonara.git
cd sonara

# Install dependencies
pnpm install

# Run in Development
pnpm tauri dev

# Build for Production
pnpm tauri build
```
<br/>

## 🧠 How It Works

Sonara keeps everything local and fast:

- Your music folder is scanned on demand
- Metadata is extracted and stored in SQLite
- React manages playback state and UI
- Tauri handles file system and native performance
- `.lrc` files are parsed for real-time lyric syncing

<br/>

## 🚀 Roadmap

- Advanced metadata editor (tags, artwork, album info)
- LRC download via external APIs
- Built-in audio equalizer
- Audio visualizer (spectrum / waveform)
- Mini-player mode

<br/>

## 📄 License

MIT License © 2026 Sonara