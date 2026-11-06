# GhorerBazar - E-commerce Platform

A full-featured e-commerce platform built with React, Vite, Tailwind CSS, and Supabase.

## 🚀 Features

- **Customer Features:**
  - Browse products by category
  - Search and filter products
  - Shopping cart with real-time updates
  - Wishlist functionality
  - User authentication (email/password and OTP)
  - Order placement and tracking
  - Contact form

- **Admin Panel:**
  - Dashboard with sales statistics
  - Product management (add, edit, delete)
  - Category and brand management
  - Order management and status updates
  - Hero banner management
  - Site settings configuration
  - Payment gateway settings (bKash, Nagad)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/monirul1128/ghorerbazar.git
cd ghorerbazar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API and copy your:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 4. Create environment file

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Setup Database

1. Go to Supabase → SQL Editor
2. Run the SQL file: `database/full-reset.sql`
3. This will create all tables and seed sample data

### 6. Create Admin User

1. Go to Supabase → Authentication → Users
2. Click "Add user" → "Create new user"
3. Fill in:
   - Email: admin@khatibissas.com (or your choice)
   - Password: [Your secure password]
   - ✅ Check "Auto Confirm User"
4. Click "Create user"

### 7. Run the development server

```bash
npm run dev
```

The site will be available at: `http://localhost:5173/`

## 🌐 Access Points

- **Customer Site**: http://localhost:5173/
- **Shop/Catalog**: http://localhost:5173/catalog
- **Admin Panel**: http://localhost:5173/admin

## 👤 Admin Login

Use the credentials you created in step 6:
- Email: admin@khatibissas.com
- Password: [Your password]

## 🏗️ Project Structure

```
├── database/           # SQL files for database setup
├── public/            # Static assets
├── src/
│   ├── admin/        # Admin panel components
│   ├── components/   # Reusable UI components
│   ├── config/       # Configuration files
│   ├── context/      # React context providers
│   ├── lib/          # Supabase and utility functions
│   ├── pages/        # Application pages
│   └── utils/        # Helper utilities
└── .env.local        # Environment variables (local only)
```

## 📦 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: HeadlessUI, Heroicons
- **Routing**: React Router v7
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## 🔒 Security Notes

- Never commit `.env` or `.env.local` files to version control
- Keep your `service_role` key secret
- Use Row Level Security (RLS) policies in Supabase
- Change default admin credentials after first login

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Developer

Developed by Monirul
- Email: admin@khatibissas.com
- GitHub: [@monirul1128](https://github.com/monirul1128)

## 🆘 Support

For issues or questions, please open an issue on GitHub or contact via email.

---

**Note**: This project is inspired by GhorerBazar and built for educational purposes.
