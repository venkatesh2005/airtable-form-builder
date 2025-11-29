# Airtable Form Builder - Deployment Guide

## Quick Deploy Links

### Backend Options

#### Option 1: Deploy to Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: airtable-form-builder-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables (see below)
6. Click "Create Web Service"

#### Option 2: Deploy to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

```bash
cd backend
railway login
railway init
railway up
```

Set environment variables:
```bash
railway variables set MONGODB_URI="your_mongodb_uri"
railway variables set AIRTABLE_CLIENT_ID="your_client_id"
railway variables set AIRTABLE_CLIENT_SECRET="your_client_secret"
railway variables set AIRTABLE_REDIRECT_URI="your_callback_url"
railway variables set FRONTEND_URL="your_frontend_url"
railway variables set SESSION_SECRET="your_secret"
railway variables set NODE_ENV="production"
```

### Frontend Options

#### Option 1: Deploy to Vercel

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

Set environment variable:
```bash
vercel env add REACT_APP_API_URL production
```

Then enter your backend URL when prompted.

Deploy to production:
```bash
vercel --prod
```

#### Option 2: Deploy to Netlify

```bash
cd frontend
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=build
```

Add environment variables in Netlify Dashboard:
- Go to Site Settings → Environment Variables
- Add `REACT_APP_API_URL` with your backend URL

## Environment Variables

### Backend Environment Variables

Required for production deployment:

```env
# MongoDB (use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Server
PORT=5000
NODE_ENV=production

# Airtable OAuth
AIRTABLE_CLIENT_ID=your_production_client_id
AIRTABLE_CLIENT_SECRET=your_production_client_secret
AIRTABLE_REDIRECT_URI=https://your-backend.com/auth/airtable/callback

# Frontend URL
FRONTEND_URL=https://your-frontend.com

# Session Secret (generate random 32+ character string)
SESSION_SECRET=generate_a_random_secret_minimum_32_characters_long

# Webhook Secret
AIRTABLE_WEBHOOK_SECRET=your_webhook_secret
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=https://your-backend.com
REACT_APP_ENV=production
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs in production)
5. Get connection string from "Connect" → "Connect your application"
6. Replace `<password>` with your database user password
7. Use this as your `MONGODB_URI`

## Update Airtable OAuth Settings

After deploying, update your Airtable OAuth integration:

1. Go to [Airtable Integrations](https://airtable.com/create/oauth)
2. Edit your integration
3. Update **Redirect URL** to: `https://your-deployed-backend.com/auth/airtable/callback`
4. Save changes

## Post-Deployment Checklist

- [ ] Backend is accessible at deployed URL
- [ ] Frontend is accessible at deployed URL
- [ ] MongoDB Atlas connection is working
- [ ] Airtable OAuth redirect URL is updated
- [ ] Test login flow end-to-end
- [ ] Test form creation
- [ ] Test form submission
- [ ] Configure Airtable webhooks to point to production backend
- [ ] Test webhook synchronization

## Monitoring

### Backend Health Check
```bash
curl https://your-backend.com/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Check Logs

**Render**: Dashboard → Your Service → Logs
**Railway**: `railway logs`
**Vercel**: Dashboard → Your Project → Deployments → View Logs
**Netlify**: Dashboard → Your Site → Deploys → Deploy Log

## Troubleshooting

### Issue: CORS Errors
- Verify `FRONTEND_URL` in backend matches actual frontend URL
- Check for trailing slashes
- Ensure `withCredentials: true` in API calls

### Issue: OAuth Redirect Error
- Verify `AIRTABLE_REDIRECT_URI` matches Airtable OAuth settings
- Check for http vs https mismatch
- Ensure backend is accessible at the configured URL

### Issue: Database Connection Failed
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

### Issue: Session Not Persisting
- Verify `SESSION_SECRET` is set
- Check that cookies are allowed in browser
- In production, ensure `secure: true` for HTTPS

## Custom Domain Setup

### Backend (Render)
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate

### Frontend (Vercel)
1. Go to Settings → Domains
2. Add your domain
3. Configure DNS
4. SSL is automatic

### Frontend (Netlify)
1. Go to Domain Settings → Add custom domain
2. Follow DNS configuration steps
3. SSL is automatic

## Scaling Considerations

- **Database**: Use MongoDB Atlas M2+ tier for production workloads
- **Backend**: Enable auto-scaling in Render/Railway
- **Frontend**: CDN is automatic with Vercel/Netlify
- **File Storage**: For attachments, use AWS S3 or similar (not included in this demo)

## Support

For deployment issues, refer to:
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
