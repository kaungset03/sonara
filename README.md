<p align="center">
  <img src="/src-tauri/icons/128x128.png" alt="Sonara Logo" width="120" />
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

<p align="center">
  <a href="https://github.com/kaungset03/sonara">
    <img src="https://img.shields.io/github/downloads/kaungset03/sonara/total?style=for-the-badge" />
  </a>
   <a href="https://github.com/kaungset03/sonara/releases/latest">
    <img src="https://img.shields.io/github/downloads/kaungset03/sonara/latest/total?style=for-the-badge" />
  </a>
</p>

<br />

## ✨ A modern, local-first music experience

Sonara is designed for people who want **speed, simplicity, and full control over their local music library**.

No streaming clutter. No ads. Just your music.

<br/>

## Preview & Screenshots

### 🎧 Library (Home)

Your complete local music collection in one place.

- Fast browsing
- Instant playback
- Clean UI

<img src="./screenshots/1.png" alt="Home" />

<br/>

<img src="./screenshots/2.png" alt="Home" />

<br/>

### 👤 Artists

Discover songs grouped by artist with rich metadata.

- Artist images
- Album grouping
- Clean navigation

<img src="./screenshots/3.png" alt="Home" />

<br/>

### 💿 Albums

Explore music grouped by albums with automatic or custom artwork.

- Auto-fetch album covers
- Manual cover upload support
- Cached for fast loading

<img src="./screenshots/4.png" alt="Home" />
  
<br/>

### ⭐ Playlists

- Personal music organization and queue management.

<img src="./screenshots/5.png" alt="Home" />

<br/>

### 🎵 Playback & Lyrics

A focused listening experience with synced lyrics.

- LRCLIB integration
- Smooth playback UI
- Real-time lyric sync

<img src="./screenshots/6.png" alt="Home" />

<br/>

### ✏️ Metadata Editor

Edit your music metadata directly inside the app.

- Edit song, album, artist info
- Stored locally (no file modification)
- Safe and reversible

<img src="./screenshots/7.png" alt="Home" />

<br/>

## 📥 Download

Get the latest version of **Sonara** from the GitHub Releases page.

<p align="center">
  <a href="https://github.com/kaungset03/sonara/releases/latest">
    <img src="https://img.shields.io/badge/Download-Latest%20Release-2ea44f?style=for-the-badge&logo=github" alt="Download Sonara" />
  </a>
</p>

### Available Downloads

| Platform              | Installer                 |
| --------------------- | ------------------------- |
| macOS (Apple Silicon) | `sonara_*_aarch64.dmg`    |
| macOS (Intel)         | `sonara_*_x64.dmg`        |
| Windows (64-bit)      | `sonara_*_x64-setup.exe`  |
| Debian / Ubuntu       | `sonara_*_amd64.deb`      |
| Linux (Universal)     | `sonara_*_amd64.AppImage` |

### Installation

<details>
<summary><strong>Windows</strong></summary>

1. Download the **Windows Installer** (`.exe`).
2. Run the installer.
3. Launch Sonara from the Start Menu.

> **Note:** Windows SmartScreen may display a warning because Sonara is not code-signed yet. Click **More info → Run anyway** to continue.

</details>

<details>
<summary><strong>macOS</strong></summary>

1. Download the correct `.dmg` for your Mac.
2. Open the disk image.
3. Drag **Sonara** into the **Applications** folder.
4. Launch Sonara from Applications.

> On first launch, macOS may ask for confirmation since the app isn't notarized yet.

</details>

<details>
<summary><strong>Debian / Ubuntu</strong></summary>

```bash
sudo dpkg -i sonara_*_amd64.deb
```

If any dependencies are missing:

```bash
sudo apt --fix-broken install
```

</details>

<details>
<summary><strong>AppImage</strong></summary>

Make the AppImage executable:

```bash
chmod +x sonara_*_amd64.AppImage
```

Run it:

```bash
./sonara_*_amd64.AppImage
```

</details>

## ✨ Features

- ⚡ Lightning fast local music scanning

- 🎨 Album & artist artwork system

- 📝 Synced lyrics support

- ✏️ Editable metadata (local-only)

- 📁 Smart library organization

- 🔒 Privacy-first (no accounts, no tracking)

<br/>

## ⚙️ How It Works

- Music folders are scanned locally

- Metadata is stored in SQLite

- React handles UI + playback state

- Rust (Tauri) powers performance & system access

- External APIs enhance artwork + lyrics

<br/>

> “Your music should belong to you — not a platform.”

Sonara is built around **local-first, privacy-focused music playback**. No accounts. No tracking. No ads.

<br/>

## 📄 License

MIT License © 2026 Sonara
