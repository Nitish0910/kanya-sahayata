# 🌸 Kanya Sahayata

Kanya Sahayata is an initiative-driven web application designed to empower girls in rural areas by providing accessible pathways to essential services like Education, Medical Health, Domestic Help, Career Guidance, Legal Aid, and Mental Health Support.

![Kanya Sahayata Banner](public/logo.png)

---

## ✨ Key Features

- **6 Core Services**: Connects rural girls with specific services (Education, Medical, Domestic, Career, Legal, Mental Health).
- **Disha AI (Virtual Assistant)**: An interactive chatbot that uses voice commands (speech-to-text) to guide users in English and Hindi, helping them find nearby NGOs and submit help requests.
- **NGO Partner Network**: A location-based directory of verified NGOs across India.
- **Real-Time Help Requests**: A multi-step form for submitting help requests mapped to specific services.
- **Admin Dashboard**: Comprehensive CMS to manage NGOs, track Help Requests, and monitor platform analytics.
- **Fully Localized**: English 🇬🇧 and Hindi 🇮🇳 toggle built into the UI.
- **Secure Authentication**: OTP verification simulation during registration, Rate Limiting, and secure user sessions.
- **Modern Minimalist UI**: Glassmorphism aesthetic, responsive grids, and subtle micro-animations.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS Modules with Glassmorphism concepts
- **State Management**: React Hooks + Context API 
- **Database**: Local JSON Storage (Configured for `/tmp` dynamic memory on Vercel)
- **Authentication**: Custom JWT-based cookie sessions with `bcryptjs`
- **Voice Interface**: Browser native Web Speech API

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have Node.js installed (v18+ recommended).

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/kanya-sahayata.git
cd kanya-sahayata
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run the development server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 💻 Vercel Deployment

This project has been structurally optimized to be deployed instantly on **Vercel**.

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Leave the default settings for Next.js and hit **Deploy**.

> **Note**: For this project, the internal \`data.json\` persistence logic routes to the ephemeral \`/tmp\` directory while hosted on serverless providers like Vercel. Any user registrations made on the Vercel app will reset upon serverless cold boots. For persistent deployment, connecting \`db.js\` to a NoSQL DB like MongoDB is heavily recommended.

---

## 🔒 Default Admin Access

To access the back-office dashboard:
- **Route**: \`/admin/login\`
- **Username**: ADMIN-001
- **Password**: admin123

---

*“When you educate a girl, you empower a nation.”*
