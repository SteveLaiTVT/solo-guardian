# Solo Guardian (独居守护)

A safety check-in app for people living alone. If you don't check in, your emergency contacts get notified.

> "Be known, not forgotten."

## 🎯 Problem

125+ million people in China live alone. If something happens to them, no one may notice for days.

Existing solutions only send email notifications, which often go unread. By the time someone checks their email, it may be too late.

## 💡 Solution

**Solo Guardian** improves on existing apps with:

| Feature | Competitors | Solo Guardian |
|---------|-------------|---------------|
| Alert Channel | Email only | Email + SMS + Push |
| Reminder | None | Customizable daily reminder |
| Contacts | 1 only | Up to 5 (premium) |
| Smart Detection | Manual only | Phone activity detection |
| Two-way | One-way alert | Contacts can request check-in |

## 📱 How It Works

```
1. Register with phone number
2. Add emergency contacts
3. Set daily reminder time
4. Check in once a day (one tap)
5. Miss check-in → Contacts get alerted
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS + PostgreSQL + Redis |
| Web | React 18 + Tailwind CSS |
| Mobile | Android: Kotlin + Compose |
| Queue | BullMQ (scheduled notifications) |
| SMS | Aliyun SMS |
| Push | Firebase Cloud Messaging |

## 📁 Project Structure

```
├── .claude/                  # AI development workflow
│   ├── DESIGN_STATE.yaml     # Product & tech spec
│   ├── prompts/              # AI session prompts
│   └── templates/            # Handoff templates
│
├── packages/                 # Shared code
│   ├── types/                # TypeScript types
│   └── api-client/           # API client
│
├── apps/
│   ├── backend/              # NestJS API server
│   ├── admin-web/            # Admin dashboard
│   ├── user-web/             # User web app
│   └── mobile/android/       # Android app
│
└── infrastructure/           # Docker, deployment
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker (for local database)
- Android Studio (for mobile)

### Setup

```bash
# Install dependencies
pnpm install

# Start database
docker-compose up -d

# Run migrations
pnpm db:migrate

# Start development
pnpm dev
```

### Development URLs

- Backend API: http://localhost:3000
- Admin Web: http://localhost:3001
- User Web: http://localhost:3002

## 💰 Monetization

**Freemium Model**

| Feature | Free | Premium (¥12/mo) |
|---------|------|------------------|
| Emergency contacts | 1 | Up to 5 |
| Email alerts | ✅ | ✅ |
| Push alerts | ✅ | ✅ |
| SMS alerts | ❌ | ✅ |
| Smart detection | ❌ | ✅ |
| Location sharing | ❌ | ✅ |

## 📋 Roadmap

### Phase 1 (MVP)
- [x] Project setup
- [ ] User authentication (phone + SMS)
- [ ] Emergency contact management
- [ ] Daily check-in
- [ ] Email + Push notifications
- [ ] Android app

### Phase 2
- [ ] SMS notifications (premium)
- [ ] Smart activity detection
- [ ] Legacy messages
- [ ] Two-way check-in requests
- [ ] iOS app

### Phase 3
- [ ] Elderly mode
- [ ] Voice check-in
- [ ] Family dashboard
- [ ] Integration with smart home devices

## 🤝 Contributing

This project uses an AI-assisted development workflow. See `.claude/` for details.

## 📄 License

MIT License

---

Built with ❤️ for those who live alone but don't want to be forgotten.