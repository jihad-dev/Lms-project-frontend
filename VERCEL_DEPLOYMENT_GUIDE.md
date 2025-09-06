# Vercel এ Next.js প্রজেক্ট ডেপ্লয় করার গাইড

## 🚀 Vercel এ আপনার LMS Frontend প্রজেক্ট ডেপ্লয় করার সম্পূর্ণ গাইড

### ১. প্রস্তুতি (Preparation)

#### প্রয়োজনীয় ফাইল চেক করুন:
- ✅ `package.json` - প্রজেক্টের dependencies এবং scripts
- ✅ `next.config.ts` - Next.js configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `vercel.json` - Vercel deployment configuration (নতুন তৈরি করা হয়েছে)
- ✅ `.env.example` - Environment variables এর উদাহরণ (নতুন তৈরি করা হয়েছে)

### ২. Vercel অ্যাকাউন্ট তৈরি করুন

1. [Vercel.com](https://vercel.com) এ যান
2. "Sign Up" এ ক্লিক করুন
3. GitHub, GitLab, বা Bitbucket অ্যাকাউন্ট দিয়ে সাইন আপ করুন
4. আপনার GitHub repository access দিন

### ৩. Environment Variables সেটআপ করুন

#### Vercel Dashboard এ:
1. আপনার প্রজেক্টে যান
2. "Settings" → "Environment Variables" এ ক্লিক করুন
3. নিচের variables গুলো add করুন:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
API_URL=https://your-backend-api.com/api
JWT_SECRET=your_secure_jwt_secret_here
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### ৪. GitHub Repository প্রস্তুত করুন

#### Git commands:
```bash
# Git repository initialize করুন (যদি না থাকে)
git init

# সব ফাইল add করুন
git add .

# Commit করুন
git commit -m "Initial commit for Vercel deployment"

# GitHub এ push করুন
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### ৫. Vercel এ প্রজেক্ট ডেপ্লয় করুন

#### Method 1: Vercel Dashboard থেকে
1. [Vercel Dashboard](https://vercel.com/dashboard) এ যান
2. "New Project" বাটনে ক্লিক করুন
3. আপনার GitHub repository select করুন
4. "Import" বাটনে ক্লিক করুন
5. Project settings configure করুন:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)

#### Method 2: Vercel CLI ব্যবহার করে
```bash
# Vercel CLI install করুন
npm i -g vercel

# Project directory এ যান
cd C:\Users\Asus\Desktop\lms-frontend-final

# Vercel এ login করুন
vercel login

# Project deploy করুন
vercel

# Production এ deploy করতে
vercel --prod
```

### ৬. Build Configuration

#### `package.json` scripts check করুন:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint"
  }
}
```

#### Production build test করুন:
```bash
npm run build
npm run start
```

### ৭. Domain Configuration (Optional)

#### Custom Domain যোগ করতে:
1. Vercel Dashboard → আপনার প্রজেক্ট → "Settings" → "Domains"
2. আপনার domain name add করুন
3. DNS settings configure করুন

### ৮. Performance Optimization

#### Vercel Analytics enable করুন:
1. Vercel Dashboard → "Analytics" tab
2. "Enable Vercel Analytics" toggle করুন

#### Image Optimization:
- `next.config.ts` এ image domains configure করা আছে
- Cloudinary integration ready

### ৯. Troubleshooting

#### Common Issues:

**Build Error:**
```bash
# Dependencies install করুন
npm install

# Build test করুন
npm run build
```

**Environment Variables Error:**
- Vercel Dashboard এ সব required environment variables add করেছেন কিনা check করুন

**API Connection Error:**
- Backend API URL সঠিক কিনা check করুন
- CORS settings check করুন

### ১০. Deployment Commands

#### Local Development:
```bash
npm run dev
```

#### Production Build:
```bash
npm run build
npm run start
```

#### Vercel Deploy:
```bash
vercel --prod
```

### ১১. Monitoring এবং Maintenance

#### Vercel Dashboard Features:
- **Deployments**: সব deployment history
- **Analytics**: Performance metrics
- **Functions**: Serverless functions logs
- **Settings**: Environment variables, domains, etc.

### ১২. Security Best Practices

1. **Environment Variables**: কখনো sensitive data code এ hardcode করবেন না
2. **JWT Secret**: Strong এবং unique JWT secret ব্যবহার করুন
3. **API Security**: HTTPS ব্যবহার করুন
4. **CORS**: Proper CORS configuration করুন

### ১৩. Backup এবং Version Control

1. **Git**: সব changes Git এ commit করুন
2. **Environment Variables**: Backup রাখুন
3. **Database**: Regular backup নিন

### ১৪. Support এবং Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## 🎉 Success!

আপনার LMS Frontend প্রজেক্ট এখন Vercel এ live! 

**Your app URL**: `https://your-app-name.vercel.app`

### Next Steps:
1. Backend API deploy করুন
2. Database setup করুন
3. User testing করুন
4. Performance optimize করুন

**Happy Coding! 🚀**
