# Theradesk OS

A professional clinical practice management system designed for mental health practitioners. Streamline client management, appointment scheduling, clinical documentation, and billing—all in one HIPAA-ready platform.

## 🚀 Features

- **Client Management**: Secure client profiles with consent tracking
- **Smart Scheduling**: Calendar with conflict detection and appointment management
- **AI-Powered Documentation**: Voice-to-text clinical notes with AI refinement
- **Session Tracking**: Complete appointment history and clinical records
- **Billing Integration**: Paystack payment processing for subscriptions
- **Practice Analytics**: Dashboard with key metrics and reports

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini API
- **Payments**: Paystack
- **Deployment**: Netlify

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/theradesk-os.git
   cd theradesk-os
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_KEY=your_google_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   ```

4. **Initialize the database**:
   
   Copy the SQL from `SCHEMA_SQL` in `src/database.ts` and run it in your Supabase SQL Editor.

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🚢 Deployment to Netlify

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in Netlify dashboard
7. Deploy!

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option 3: Drag & Drop

```bash
# Build locally
npm run build

# Go to https://app.netlify.com/drop
# Drag and drop the 'dist' folder
```

## 🔐 Environment Variables

Set these in your Netlify dashboard under **Site settings** → **Environment variables**:

| Variable | Description |
|----------|-------------|
| `VITE_API_KEY` | Google Gemini API key for AI features |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key for payments |

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🗄️ Database Schema

The application uses the following tables:
- `practitioners` - User accounts and practice information
- `clients` - Client profiles and medical records
- `appointments` - Session scheduling and tracking
- `notes` - Clinical documentation
- `audit_logs` - Activity tracking for compliance

## 🔒 Security & Compliance

- HIPAA-ready infrastructure via Supabase
- Encrypted data transmission (SSL/TLS)
- Secure authentication with Supabase Auth
- Role-based access control
- Audit logging for all clinical actions

## 🧪 Demo Mode

The app includes a demo mode for testing. Click "Quick Launch Demo" on the login screen to explore features without creating an account.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For inquiries, please contact the development team.

## 📞 Support

For technical support or questions:
- Email: support@theradesk.os
- Documentation: [Coming Soon]

---

**Built with ❤️ for mental health professionals**