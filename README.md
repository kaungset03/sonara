<p align="center">
  <img src="https://i.ibb.co/0RtJb89c/64x64.png" alt="Sonara Logo" width="120" />
</p>

<h1 align="center">Sonara</h1>

<p align="center">
  <b>A sleek, lightweight desktop music player built with Tauri + React</b>
</p>

<p align="center">
  Fast. Local-first. Distraction-free.
</p>

<p align="center">
  <a href="https://github.com/kaungset03/sonara/releases">
    <img src="https://img.shields.io/github/v/release/kaungset03/sonara?style=for-the-badge" />
  </a>
  <a href="https://github.com/kaungset03/sonara/stargazers">
    <img src="https://img.shields.io/github/stars/kaungset03/sonara?style=for-the-badge" />
  </a>
  <a href="https://github.com/kaungset03/sonara/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/kaungset03/sonara?style=for-the-badge" />
  </a>
</p>

<br />

## ✨ A better way to experience your music

Sonara is designed for people who want **speed, simplicity, and full control over their local music library**.

No streaming clutter. No ads. Just your music.

<br />

## 🎧 Features

### ⚡ Lightning Fast Playback

Instantly scan and play your local music folders with near-native performance.

### 🎨 Beautiful Album & Artist Art

- Auto-fetch artwork from APIs
- Or upload your own custom images
- Fully local-first and editable

### 📝 Lyrics Support

- Fetch lyrics from external APIs
- Or upload your own lrc file
- Smooth integration with playback

### ✏️ Safe Metadata Editing

- Edit song metadata inside the app
- Stored in local database only
- Your original files are never modified

### 📁 Smart Library Management

- Auto-organized library view
- Albums, artists, folders all indexed locally

<br />

## 📦 Run Locally (Development Setup)

For those who want to run Sonara on their local machine.

### Prerequisites

Make sure you have installed:

- Node.js
- pnpm (recommended)
- Rust (for Tauri)

### Setup

```bash
# Clone the repo
git clone https://github.com/kaungset03/sonara.git
cd sonara

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev

# Build for production (local build)
pnpm tauri build

```

<br/>

## Download

Choose the correct version for your system:

| Operating System      | File                                                 |
| --------------------- | ---------------------------------------------------- |
| macOS (Apple Silicon) | `Sonara_*_aarch64.dmg`                               |
| macOS (Intel)         | `Sonara_*_x64.dmg`                                   |
| Windows               | `Sonara_*_x64-setup.exe` or `Sonara_*_x64_en-US.msi` |
| Linux (Debian/Ubuntu) | `Sonara_*_amd64.deb`                                 |
| Linux (Universal)     | `Sonara_*_amd64.AppImage`                            |

👉 Latest release:  
https://github.com/kaungset03/sonara/releases

<br/>

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Rust (Tauri)
- **UI:** Tailwind CSS + shadcn/ui
- **Database:** SQLite (local-first)
- **Audio Engine:** Native system audio / HTML5 Audio API

<br />

## How It Works

- Your music folders are scanned locally
- Metadata is stored in SQLite (not your files)
- React handles UI + playback state
- Rust (Tauri) handles system-level performance
- Optional APIs enhance artwork + lyrics

<br/>

> “Your music should belong to you — not a platform.”

Sonara is built around **local-first, privacy-focused music playback**.

No accounts. No tracking. No ads.

<br/>

## 📄 License

MIT License © 2026 Sonara

---

<p align="center">
  Made with ❤️ using Rust + Tauri + React
</p>
