# WarmTrial - PeopleOS for Pre-HR Startups

The complete hiring platform for early-stage startups. From founder intake to warm intros, vibe checks, and trial work - all in one place.

## 🚀 Features

### Module 1: Hiring Layer (Complete)
- **Founder Intake Form** - Define role requirements, culture fit, and urgency
- **AI-Powered Matching** - Get 3-5 pre-screened candidates that match your needs
- **Async Vibe Check** - Candidates submit 60s videos and structured Q&A forms
- **Trial Work Workflow** - Test candidates with real, paid projects before hiring
- **Offer Letter Generator** - Create professional offers with customizable terms
- **Salary & Equity Benchmarking** - Live compensation data by role, location, and stage

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Backend:** Next.js API routes (Node.js)
- **Database:** PostgreSQL via Prisma
- **Authentication:** NextAuth.js with magic link
- **Payments:** Stripe Checkout + Webhooks
- **AI/Matching:** OpenAI embeddings (ready for integration)
- **Video Recording:** react-webcam
- **PDF Generation:** jsPDF

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for trial payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/javohirakram/warmtrial.git
cd warmtrial
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/warmtrial"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI (optional)
OPENAI_API_KEY="sk-..."
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see WarmTrial in action!

## 📚 Project Structure

```
src/
├── app/
│   ├── api/           # Backend API routes
│   ├── auth/          # Authentication pages
│   ├── intake/        # Founder intake form
│   ├── matches/       # Candidate matches
│   ├── vibe-check/    # Video & Q&A workflow
│   ├── trial/         # Trial work & payments
│   ├── offer/         # Offer letter generator
│   └── benchmark/     # Salary benchmarking
├── components/        # Reusable UI components
├── data/             # Sample data & templates
├── lib/              # Auth, Prisma, utilities
└── types/            # TypeScript definitions
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Database Setup

We recommend:
- **Supabase** (PostgreSQL with great free tier)
- **Railway** (Easy PostgreSQL hosting)
- **PlanetScale** (MySQL alternative)

## 🎯 Roadmap

### Completed ✅
- [x] Complete hiring pipeline (intake → matches → vibe check → trial → offer)
- [x] Stripe payment integration
- [x] PDF offer letter generation
- [x] Salary benchmarking tool
- [x] Professional UI/UX

### Coming Soon 🔄
- [ ] Real-time AI matching with OpenAI embeddings
- [ ] Email notifications (SendGrid/Resend)
- [ ] Video upload to cloud storage (S3/Cloudinary)
- [ ] Advanced analytics dashboard
- [ ] Candidate feedback system
- [ ] Multi-company support

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Need help? Reach out:
- Email: support@warmtrial.com
- GitHub Issues: [Create an issue](https://github.com/javohirakram/warmtrial/issues)

---

Built with ❤️ for startup founders who want to hire amazing talent with confidence.
