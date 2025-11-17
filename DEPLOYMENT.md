# Netlify Deployment Guide

## 🚀 Quick Deploy (5 Minutes)

Your Website Audit Tool is **ready to deploy** to Netlify right now!

### Prerequisites

Before deploying, you need:

1. **Google API Key** (Get it [here](https://console.cloud.google.com/apis/credentials))
   - Enable: PageSpeed Insights API
   - Enable: Search Console API

2. **Zapier Webhook** (Optional - for email capture)
   - Create a Zap at [Zapier](https://zapier.com/)
   - Use "Webhooks by Zapier" trigger
   - Copy the webhook URL

3. **Booking Link** (Optional)
   - Your Calendly/calendar link for consultations

---

## Method 1: Deploy from GitHub (Recommended)

### Step 1: Push Code to GitHub

If you haven't already:

```bash
git push -u origin claude/website-audit-tool-01U9fzLYtfTVwheh6qsfRdFx
```

### Step 2: Connect to Netlify

1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your repository: `ken-allen-3/website-audit`
5. Select branch: `claude/website-audit-tool-01U9fzLYtfTVwheh6qsfRdFx`

### Step 3: Configure Build Settings

Netlify should auto-detect these settings (verify they match):

```
Build command:   npm run build
Publish directory: build
```

**Advanced settings:**
- Add environment variable: `NODE_VERSION` = `18`

### Step 4: Add Environment Variables

Before deploying, add these in Netlify:

Go to **Site settings → Environment variables → Add a variable**

```
REACT_APP_GOOGLE_API_KEY = your_google_api_key_here
REACT_APP_ZAPIER_WEBHOOK = https://hooks.zapier.com/your_webhook
REACT_APP_BOOKING_LINK = https://calendly.com/your-link
```

### Step 5: Deploy!

Click **"Deploy site"**

Your site will build and deploy in 2-3 minutes.

You'll get a URL like: `https://random-name-123.netlify.app`

---

## Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login

```bash
netlify login
```

This will open your browser to authorize.

### Step 3: Initialize Site

```bash
netlify init
```

Follow the prompts:
- Choose: **Create & configure a new site**
- Team: Select your team
- Site name: Enter a custom name (optional)
- Build command: `npm run build`
- Publish directory: `build`

### Step 4: Set Environment Variables

```bash
netlify env:set REACT_APP_GOOGLE_API_KEY "your_api_key_here"
netlify env:set REACT_APP_ZAPIER_WEBHOOK "your_webhook_url"
netlify env:set REACT_APP_BOOKING_LINK "your_booking_link"
```

### Step 5: Deploy

```bash
netlify deploy --prod
```

---

## Method 3: Manual Drag & Drop

### Step 1: Build Locally

```bash
# Install dependencies
npm install

# Create .env file with your keys
cp .env.example .env
# Edit .env with your actual values

# Build the project
npm run build
```

This creates a `build/` folder with your compiled app.

### Step 2: Deploy to Netlify

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop your `build/` folder onto the page
3. Your site deploys instantly!

**Note:** With drag & drop, you need to:
- Manually add environment variables in Site settings
- Redeploy by dragging the build folder again for updates

---

## Post-Deployment Setup

### 1. Custom Domain (Optional)

In Netlify dashboard:
1. Go to **Site settings → Domain management**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions

### 2. HTTPS (Automatic)

Netlify automatically provisions a free SSL certificate. Your site will be HTTPS within minutes.

### 3. Test Your Site

Visit your Netlify URL and test:
- ✅ Enter a business name and website URL
- ✅ Run an audit
- ✅ Check all scores display correctly
- ✅ Test email capture (if webhook configured)
- ✅ Test on mobile device

### 4. Verify Environment Variables

Check that your environment variables are working:
- Open browser console (F12)
- You should NOT see any API key errors
- If you see "API Key Invalid", verify your environment variables in Netlify

---

## Troubleshooting

### Build Fails

**Error:** "Command failed with exit code 1"

**Solution:**
1. Check that Node version is set to 18 in Netlify
2. Clear cache and retry: Site settings → Build & deploy → Clear cache
3. Check build logs for specific errors

### Environment Variables Not Working

**Error:** "REACT_APP_GOOGLE_API_KEY is undefined"

**Solution:**
1. Ensure variables are set in Netlify dashboard (not in code)
2. Redeploy after adding variables
3. Variable names MUST start with `REACT_APP_`

### API Calls Failing

**Error:** CORS or network errors

**Solution:**
1. Verify Google API key is valid
2. Check that PageSpeed Insights API is enabled
3. Verify API key restrictions allow your Netlify domain
4. For production, consider setting up a backend proxy

### Site Loads but Shows Blank Page

**Error:** Blank page or infinite loading

**Solution:**
1. Check browser console for JavaScript errors
2. Verify all files deployed correctly
3. Check _redirects file is in place for SPA routing
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## Continuous Deployment

Once connected to GitHub, Netlify automatically:
- Deploys on every push to your branch
- Runs build checks on pull requests
- Provides deploy previews for branches

To disable auto-deploy:
**Site settings → Build & deploy → Continuous deployment → Stop auto publishing**

---

## Performance Monitoring

### Netlify Analytics

Enable analytics to track:
- Page views
- Unique visitors
- Top pages
- Traffic sources

**Site settings → Analytics → Enable**

### Lighthouse Scores

After deployment, run a Lighthouse audit:
1. Open site in Chrome
2. Press F12 → Lighthouse tab
3. Click "Generate report"

Your site should score 90+ in all categories!

---

## Cost

**Free tier includes:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Continuous deployment
- HTTPS
- Forms (100 submissions/month)

Perfect for this project! ✅

---

## Next Steps

1. **Set up Google API Key** - Follow instructions in README.md
2. **Configure Zapier** - Set up webhook for email capture
3. **Deploy to Netlify** - Use any method above
4. **Share your live site!** 🎉

---

## Support

For deployment issues:
- Check [Netlify Docs](https://docs.netlify.com/)
- Review build logs in Netlify dashboard
- Verify environment variables are set correctly

Your Website Audit Tool is production-ready and optimized for Netlify deployment!
