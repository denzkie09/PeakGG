<div align="center">

<br />

# ⚡ PeakGG

### *Reach your peak. Track your grind.*

A modern gaming stats platform that lets you track match history, analyze performance, and compare yourself against other players and pro players — across **Valorant**, **League of Legends**, **CS2**, and **Dota 2**.

<br />

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=react&logoColor=white)

<br />

</div>

---

## 📸 Overview

PeakGG is a full-stack gaming stats dashboard built with **Next.js 15** and **TypeScript**. Connect your Riot or Steam account and instantly see your stats, match history, and how you stack up against other players and professionals.

Each game has its own **unique themed page** — no generic dashboards here. Valorant gets a sharp red tactical look, League of Legends gets a gold regal aesthetic, CS2 gets a military HUD feel, and Dota 2 gets a dark bronze fantasy design.

---

## 🎮 Supported Games

| Game | Stats | Match Detail | Pro Comparison |
|------|-------|-------------|----------------|
| **Valorant** | Rank, KDA, ACS, HS%, Win Rate, Agent Stats, Map Performance | ✅ | ✅ |
| **League of Legends** | Rank, KDA, CS, Vision Score, Champion Stats | ✅ | ✅ |
| **CS2** | ELO, K/D, HS%, Rating, Map Performance | ✅ | ✅ |
| **Dota 2** | MMR, KDA, GPM, XPM, Hero Stats, Item Timeline, Skill Build | ✅ | ✅ |

---

## ✨ Features

- 🔐 **Account Linking** — Sign in with your Riot or Steam account via OAuth
- 📊 **Per-Game Dashboards** — Each game has its own dedicated page with unique design
- 🗺️ **Match History** — Recent matches with full KDA, map, agent/hero, and result
- 📈 **Performance Charts** — Radar charts, bar charts, and trend lines powered by Recharts
- ⚔️ **Player Comparison** — Compare your stats side-by-side with any player or search by username
- 🏆 **Pro Player Stats** — Benchmark yourself against pros like TenZ, Faker, s1mple, and more
- 🎯 **Dota 2 Match Detail** — Full breakdown with item buy timeline and skill build grid
- 🌙 **Dark Theme** — Sleek dark UI with per-game color accents
- 📱 **Responsive Layout** — Works across desktop and mobile

---

## 🗂️ Project Structure

```
statforge/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Overview dashboard (all games)
│   │   ├── games/
│   │   │   ├── valorant/       # Valorant themed page
│   │   │   ├── league/         # League of Legends themed page
│   │   │   ├── cs2/            # CS2 themed page
│   │   │   └── dota2/          # Dota 2 themed page + match detail
│   │   ├── compare/            # Player vs player / player vs pro
│   │   ├── players/            # Player search and browse
│   │   ├── pro/                # Pro player profiles
│   │   ├── login/              # Login page (Riot / Steam)
│   │   └── api/
│   │       ├── auth/           # OAuth routes (Riot RSO + Steam OpenID)
│   │       └── image-proxy/    # CDN image proxy
│   ├── components/
│   │   ├── layout/             # Sidebar, AuthGuard
│   │   └── ui/                 # StatCard, MatchRow, MapStats, GameSelector
│   ├── context/
│   │   └── AuthContext.tsx     # Global auth state
│   ├── lib/
│   │   ├── mock/               # Mock data for all 4 games
│   │   └── valorant-assets.ts  # Valorant CDN asset helpers
│   └── types/
│       └── index.ts            # Shared TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Riot developer API key *(get one at [developer.riotgames.com](https://developer.riotgames.com))*
- A Steam API key *(get one at [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey))*

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/peakgg.git
cd peakgg

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Riot Games API
RIOT_API_KEY=RGAPI-xxxx-xxxx-xxxx-xxxx

# Riot OAuth (for RSO login — requires approved app)
RIOT_CLIENT_ID=your_client_id
RIOT_CLIENT_SECRET=your_client_secret

# Steam
STEAM_API_KEY=your_steam_api_key
```

> ⚠️ **Never commit `.env.local` to GitHub.** It's already in `.gitignore`.

---

## 🔌 API Integrations

### Riot Games
- **Auth:** Riot Sign On (RSO) OAuth 2.0
- **Endpoints used:** `/riot/account/v1`, `/val/match/v1`, `/lol/summoner/v4`, `/lol/match/v5`
- **Docs:** [developer.riotgames.com](https://developer.riotgames.com)

> 🔑 Dev keys expire every 24 hours. Apply for a production key for persistent deployment.

### Steam / Valve
- **Auth:** Steam OpenID 2.0 (no app approval needed)
- **Endpoints used:** `ISteamUser`, `IPlayerService`, Dota 2 Match API
- **Docs:** [developer.valvesoftware.com/wiki/Steam_Web_API](https://developer.valvesoftware.com/wiki/Steam_Web_API)

---

## 🛣️ Roadmap

- [ ] Real Riot API integration (Valorant + LoL live data)
- [ ] Real Steam API integration (CS2 + Dota 2 live data)
- [ ] User authentication with database (PostgreSQL + Prisma)
- [ ] Redis caching layer for API rate limit management
- [ ] Leaderboard page
- [ ] Match timeline graphs
- [ ] Mobile responsive improvements
- [ ] Vercel deployment

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Charts | Recharts |
| Icons | Lucide React |
| Auth | Riot RSO + Steam OpenID |
| Deployment | Vercel *(planned)* |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## ⚠️ Disclaimer

PeakGG is not affiliated with, endorsed, or sponsored by Riot Games, Valve Corporation, or any of their subsidiaries. All game assets, trademarks, and copyrights belong to their respective owners.

---

<div align="center">

Built with ❤️ by a developer who loves gaming and code.

⭐ **Star this repo if you found it useful!**

</div>
