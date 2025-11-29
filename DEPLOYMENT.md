# 🚀 Deployment Guide

Complete step-by-step guide to deploy the Airtable Form Builder application to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub account and repository with your code
- [ ] MongoDB Atlas account (for database)
- [ ] Airtable OAuth integration configured
- [ ] All environment variables ready
- [ ] Code committed and pushed to GitHub

---

## 🗄️ Step 1: Setup MongoDB Atlas

### 1.1 Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **"M0 Free"** tier
5. Select your preferred region (choose closest to your backend deployment)
6. Click **"Create Cluster"**

### 1.2 Configure Database Access

1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `formbuilder`
5. Click **"Autogenerate Secure Password"** (save this!)
6. Database User Privileges: **"Atlas Admin"**
7. Click **"Add User"**

### 1.3 Configure Network Access

1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access From Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` with `formbuilder`
5. Replace `<password>` with the password you saved
6. Add database name: `airtable-form-builder`
   ```
   mongodb+srv://formbuilder:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/airtable-form-builder?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Deploy Backend

### Option A: Deploy to Render (Recommended)

#### 2A.1 Create Render Account

1. Go to [Render](https://render.com/)
2. Sign up with GitHub
3. Authorize Render to access your repositories

#### 2A.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `airtable-formbuilder-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

#### 2A.3 Add Environment Variables

Click **"Advanced"** → Add Environment Variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://formbuilder:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/airtable-form-builder?retryWrites=true&w=majority
AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
AIRTABLE_REDIRECT_URI=https://your-backend-url.onrender.com/auth/airtable/callback
FRONTEND_URL=https://your-frontend-url.vercel.app
SESSION_SECRET=generate_random_64_char_string
AIRTABLE_WEBHOOK_SECRET=generate_random_string
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2A.4 Deploy

1. Click **"Create Web Service"**
2. Wait 2-5 minutes for deployment
3. Your backend URL: `https://airtable-formbuilder-api.onrender.com`
4. Test: Visit `https://airtable-formbuilder-api.onrender.com/health`

### Option B: Deploy to Railway

#### 2B.1 Install Railway CLI

```bash
npm install -g @railway/cli
```

#### 2B.2 Login and Initialize

```bash
cd backend
railway login
railway init
```

#### 2B.3 Add Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="your_mongodb_atlas_connection_string"
railway variables set AIRTABLE_CLIENT_ID="your_client_id"
railway variables set AIRTABLE_CLIENT_SECRET="your_client_secret"
railway variables set AIRTABLE_REDIRECT_URI="https://your-backend.up.railway.app/auth/airtable/callback"
railway variables set FRONTEND_URL="https://your-frontend.vercel.app"
railway variables set SESSION_SECRET="generate_random_string"
railway variables set AIRTABLE_WEBHOOK_SECRET="generate_random_string"
```

#### 2B.4 Deploy

```bash
railway up
```

Your backend URL: Check Railway dashboard for your deployment URL

---

## 🎨 Step 3: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

#### 3A.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 3A.2 Login

```bash
vercel login
```

#### 3A.3 Deploy

```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **airtable-form-builder**
- Directory? **./
** (current directory)
- Override settings? **N**

#### 3A.4 Add Environment Variable

```bash
vercel env add REACT_APP_API_URL
```

Enter value: `https://airtable-formbuilder-api.onrender.com`

Choose environments: **Production, Preview, Development**

#### 3A.5 Redeploy with Environment Variable

```bash
vercel --prod
```

Your frontend URL: Check Vercel output for deployment URL (e.g., `https://airtable-form-builder.vercel.app`)

### Option B: Deploy to Netlify

#### 3B.1 Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 3B.2 Login

```bash
netlify login
```

#### 3B.3 Build Frontend

```bash
cd frontend
npm run build
```

#### 3B.4 Deploy

```bash
netlify deploy --prod
```

Follow prompts:
- Create & configure new site
- Team: **Your team**
- Site name: **airtable-form-builder**
- Publish directory: **build**

#### 3B.5 Add Environment Variable

1. Go to Netlify Dashboard
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Add variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://airtable-formbuilder-api.onrender.com`
5. Click **"Save"**

#### 3B.6 Trigger Redeploy

```bash
netlify deploy --prod --build
```

---

## 🔐 Step 4: Update Airtable OAuth Settings

### 4.1 Update Redirect URI

1. Go to [Airtable OAuth Integrations](https://airtable.com/create/oauth)
2. Find your OAuth integration
3. Click **"Edit"**
4. Add production redirect URI:
   ```
   https://airtable-formbuilder-api.onrender.com/auth/airtable/callback
   ```
5. Keep development URI for local testing:
   ```
   http://localhost:5000/auth/airtable/callback
   ```
6. Click **"Save changes"**

---

## ✅ Step 5: Test Deployment

### 5.1 Test Backend

Visit: `https://your-backend-url.onrender.com/health`

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "mongodb": "connected"
}
```

### 5.2 Test Frontend

1. Visit: `https://your-frontend-url.vercel.app`
2. Click **"Login with Airtable"**
3. Authorize the application
4. Should redirect to dashboard

### 5.3 Test Full Flow

1. Create an Airtable base with a table
2. Create a form in the application
3. Submit a test response
4. Verify data appears in:
   - Airtable base
   - Dashboard responses

---

## 🔄 Step 6: Setup Custom Domain (Optional)

### 6.1 Frontend Domain (Vercel)

1. Go to Vercel Dashboard → Your project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `forms.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update `FRONTEND_URL` in backend environment variables

### 6.2 Backend Domain (Render)

1. Go to Render Dashboard → Your service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain (e.g., `api.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update `AIRTABLE_REDIRECT_URI` in backend env
6. Update Airtable OAuth redirect URI

---

## 🐛 Troubleshooting

### Backend Issues

**Error: MongoDB connection failed**
```
Solution: Check MongoDB Atlas connection string and IP whitelist
```

**Error: OAuth redirect URI mismatch**
```
Solution: Verify AIRTABLE_REDIRECT_URI matches OAuth integration exactly
```

**Error: CORS blocked**
```
Solution: Check FRONTEND_URL in backend matches frontend domain exactly
```

### Frontend Issues

**Error: Network Error / Failed to fetch**
```
Solution: Check REACT_APP_API_URL is set correctly and backend is running
```

**Error: Blank page after deployment**
```
Solution: Check browser console for errors, rebuild with correct API URL
```

### OAuth Issues

**Error: Invalid client credentials**
```
Solution: Verify AIRTABLE_CLIENT_SECRET is correct
```

**Error: Redirect URI mismatch**
```
Solution: Ensure redirect URI in Airtable OAuth settings matches backend URL exactly
```

---

## 📊 Monitoring

### Backend Health Checks

Render automatically monitors: `https://your-backend-url.onrender.com/health`

Railway monitors: Automatic health checks on root endpoint

### Database Monitoring

MongoDB Atlas Dashboard:
1. Go to **"Metrics"**
2. Monitor connections, operations, and storage

---

## 🔧 Updating Deployment

### Update Backend

**Render:** Automatically deploys on git push to main branch

**Railway:**
```bash
cd backend
railway up
```

### Update Frontend

**Vercel:** Automatically deploys on git push to main branch

**Netlify:**
```bash
cd frontend
netlify deploy --prod --build
```

---

## 📝 Environment Variables Summary

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
AIRTABLE_CLIENT_ID=your_client_id
AIRTABLE_CLIENT_SECRET=your_client_secret
AIRTABLE_REDIRECT_URI=https://api.yourdomain.com/auth/airtable/callback
FRONTEND_URL=https://forms.yourdomain.com
SESSION_SECRET=generate_64_char_random_string
AIRTABLE_WEBHOOK_SECRET=generate_random_string
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://api.yourdomain.com
```

---

## 🎉 Deployment Complete!

Your application is now live at:
- **Frontend**: https://your-frontend-url.vercel.app
- **Backend**: https://your-backend-url.onrender.com
- **Database**: MongoDB Atlas

### Next Steps:

1. ✅ Share the frontend URL with users
2. ✅ Monitor logs in Render/Railway dashboard
3. ✅ Check MongoDB Atlas metrics
4. ✅ Test all features in production
5. ✅ Set up custom domains (optional)

---

## 📞 Support

For deployment issues:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Netlify: https://docs.netlify.com

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: November 27, 2025
