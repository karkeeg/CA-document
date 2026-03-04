# CA-Document - Secure Document Management System

CA-Document is a premium, zero-trust document management platform built with a focus on security, performance, and a professional user experience.

## 🚀 Built With

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: [Prisma](https://www.prisma.io/) ORM
- **Authentication**: Custom Session-based Auth with Sliding Window
- **Security**: 
  - [Argon2](https://github.com/ranisalt/node-argon2) for advanced password hashing
  - [Redis](https://redis.io/) (via ioredis) for high-performance rate limiting
- **UI/UX**: Custom CSS System with Design Tokens (Vanilla CSS)

## ✨ Features

- **Auth Flow**: Complete authentication system including Login, Signup, Forgot Password, Reset Password, and Email Verification.
- **Premium UI**: Modern, responsive design with glassmorphism, smooth transitions, and a custom centering layout.
- **Zero-Trust Principles**: Secure-by-design architecture with focus on data integrity.
- **Security Rate Limiting**: Redis-backed protection against brute-force and credential stuffing.
- **Session Management**: Secure, sliding-window sessions that automatically extend with active use.
- **Form Validation**: Client and server-side validation using [Zod](https://zod.dev/).

## 🛠️ Security Techniques Used

1. **Sliding Window Sessions**: Sessions stay active as long as the user is active, but expire automatically after inactivity.
2. **Argon2 Hashing**: Utilizing the winner of the Password Hashing Competition (PHC) for maximum security.
3. **Fail-Closed Strategy**: Rate limiting and session validation are designed to prioritize security in case of infrastructure issues.
4. **Tokenization**: Opaque session tokens to prevent information leakage.
5. **Security-First UX**: Informative error messages that don't leak account existence (constant-time/agnostic responses).

## 🏃 Getting Started

### Prerequisites

- Node.js 18.x or later
- Redis instance (optional for dev, required for rate-limiting)
- Database (PostgreSQL/MySQL supported via Prisma)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ca-document.git
   cd ca-document
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-database-url"
   REDIS_URL="your-redis-url"
   # ... other necessary config
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

## 📁 Project Structure

- `src/app/(auth)`: Shared layout and professional auth pages.
- `src/components/ui`: Custom styled UI components.
- `src/lib/auth`: Core authentication and session logic.
- `src/lib/security`: Protection layers like rate limiting.
- `src/lib/db.ts`: Prisma client initialization.

---
*Built with ❤️ by the NextWave Team*
