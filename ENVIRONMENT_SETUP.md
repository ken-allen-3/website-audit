# Environment Variables Setup Guide

Complete step-by-step instructions to get all required API keys and credentials for the Website Audit Tool.

---

## 🔑 Environment Variables You Need

```env
REACT_APP_GOOGLE_API_KEY     # Required - For PageSpeed & Mobile tests
REACT_APP_ZAPIER_WEBHOOK      # Optional - For email capture
REACT_APP_BOOKING_LINK        # Optional - Your calendar link
```

---

## 1. Get Google API Key (REQUIRED)

### Step 1: Go to Google Cloud Console

Visit: **[https://console.cloud.google.com/](https://console.cloud.google.com/)**

Sign in with your Google account.

### Step 2: Create a New Project (or Select Existing)

1. Click the **project dropdown** at the top (next to "Google Cloud")
2. Click **"NEW PROJECT"**
3. Enter project name: `Website Audit Tool`
4. Click **"CREATE"**
5. Wait for project to be created (10-20 seconds)
6. Make sure your new project is selected in the dropdown

### Step 3: Enable PageSpeed Insights API

1. In the search bar at the top, type: **"PageSpeed Insights API"**
2. Click on **"PageSpeed Insights API"** in the results
3. Click the blue **"ENABLE"** button
4. Wait for it to enable (5-10 seconds)

### Step 4: Enable Search Console API (for Mobile-Friendly Test)

1. In the search bar, type: **"Search Console API"**
2. Click on **"Search Console API"** or **"Google Search Console API"**
3. Click the blue **"ENABLE"** button
4. Wait for it to enable

### Step 5: Create API Key

1. Click the **hamburger menu** (☰) in the top-left
2. Navigate to: **APIs & Services → Credentials**
   - Direct link: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
3. Click **"+ CREATE CREDENTIALS"** at the top
4. Select **"API key"**
5. Your API key will be created! Copy it immediately.

**Your API key looks like:** `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 6: Restrict Your API Key (IMPORTANT for Security)

Don't skip this! Unrestricted keys can be stolen and abused.

1. A popup will appear after creating the key. Click **"EDIT API KEY"** (or find your key in the list and click it)
2. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check **only these two APIs**:
     - ✅ PageSpeed Insights API
     - ✅ Search Console API
   - Click **"Save"**

3. Under **"Application restrictions"** (optional but recommended for production):
   - Select **"HTTP referrers (web sites)"**
   - Click **"ADD AN ITEM"**
   - Add your Netlify domain: `https://your-site-name.netlify.app/*`
   - Add localhost for testing: `http://localhost:3000/*`
   - Click **"Save"**

### ✅ Done! Copy Your API Key

```env
REACT_APP_GOOGLE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 2. Get Zapier Webhook URL (OPTIONAL)

This is for capturing emails and sending audit reports. Skip if you don't need this feature.

### Step 1: Sign Up for Zapier

Visit: **[https://zapier.com/app/signup](https://zapier.com/app/signup)**

Free plan is fine! (100 tasks/month)

### Step 2: Create a New Zap

1. Click **"Create Zap"** button (usually top-right)
2. You'll be in the Zap editor

### Step 3: Set Up the Trigger (Webhook)

1. In the **"Trigger"** section:
   - Search for: **"Webhooks by Zapier"**
   - Click it to select

2. Choose trigger event:
   - Select: **"Catch Hook"**
   - Click **"Continue"**

3. Set up trigger:
   - Leave **"Pick off a Child Key"** blank
   - Click **"Continue"**

4. **COPY YOUR WEBHOOK URL!**
   - Zapier shows: `https://hooks.zapier.com/hooks/catch/123456/xxxxxx/`
   - **Copy this entire URL** - this is your webhook!

### Step 4: Set Up the Action (What Happens with Data)

Now configure what happens when someone submits their email:

**Option A: Send Email**

1. Click **"+" to add an action**
2. Search for and select: **"Email by Zapier"** (free) or **"Gmail"** (requires connection)
3. Choose action: **"Send Outbound Email"**
4. Click **"Continue"**
5. Connect your email account (if using Gmail)
6. Configure email:
   - **To**: Map to `email` field from webhook
   - **Subject**: "Your Website Audit Report for [Business Name]"
   - **Body**: Create a nice template with audit results
7. Click **"Continue"** and **"Test"**

**Option B: Add to Google Sheets**

1. Click **"+" to add an action**
2. Search for: **"Google Sheets"**
3. Choose action: **"Create Spreadsheet Row"**
4. Connect your Google account
5. Select/create your spreadsheet
6. Map fields:
   - `name` → Column A
   - `email` → Column B
   - `businessName` → Column C
   - `website` → Column D
   - `auditResults.overall` → Column E
   - etc.

**Option C: Add to CRM**

Search for your CRM (HubSpot, Salesforce, etc.) and map the fields.

### Step 5: Test Your Webhook

1. Before finishing, go back to the **Trigger** step
2. Click **"Test trigger"**
3. Open a new tab and run this in browser console (F12):

```javascript
fetch('YOUR_WEBHOOK_URL_HERE', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    businessName: "Test Business",
    website: "https://example.com",
    auditResults: {
      speed: 85,
      seo: 90,
      mobile: 88,
      accessibility: 75,
      security: 95,
      overall: 87,
      grade: "B",
      issues: []
    }
  })
})
```

4. Go back to Zapier and click **"Test trigger"** again
5. You should see your test data appear!
6. Click **"Continue"** to finish

### Step 6: Turn On Your Zap

1. Click **"Publish"** or **"Turn on Zap"**
2. Give it a name: "Website Audit Email Capture"

### ✅ Done! Copy Your Webhook URL

```env
REACT_APP_ZAPIER_WEBHOOK=https://hooks.zapier.com/hooks/catch/123456/xxxxxx/
```

---

## 3. Get Booking Link (OPTIONAL)

This is the link users click to schedule a consultation with you.

### Option A: Calendly (Recommended - Free)

1. Go to **[https://calendly.com/signup](https://calendly.com/signup)**
2. Sign up (free plan is fine)
3. Create an event type (e.g., "Website Consultation")
4. Copy your Calendly link: `https://calendly.com/your-name/consultation`

### Option B: Google Calendar Appointment Schedules

1. Go to **[https://calendar.google.com/](https://calendar.google.com/)**
2. Click the **"+"** next to "Other calendars"
3. Select **"Create new calendar"** → Name it
4. Use Google Calendar's appointment scheduling feature
5. Share the booking link

### Option C: Your Own Link

Use any link you want:
- Your contact page: `https://yoursite.com/contact`
- Email link: `mailto:you@example.com`
- Phone booking page
- Any other booking system

### ✅ Done! Copy Your Booking Link

```env
REACT_APP_BOOKING_LINK=https://calendly.com/your-name/consultation
```

---

## 📝 Create Your .env File

### For Local Development

1. In your project root, create a file named `.env`:

```bash
# In your website-audit folder
touch .env
```

2. Open `.env` and paste:

```env
REACT_APP_GOOGLE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_ZAPIER_WEBHOOK=https://hooks.zapier.com/hooks/catch/123456/xxxxxx/
REACT_APP_BOOKING_LINK=https://calendly.com/your-name/consultation
```

3. **Save the file**

4. **NEVER commit this file to git!** (Already in `.gitignore`)

### For Netlify Deployment

**Do NOT put your actual keys in code!** Set them in Netlify dashboard:

1. Go to your site in [Netlify](https://app.netlify.com/)
2. Click **"Site settings"**
3. Click **"Environment variables"** (in the sidebar under "Build & deploy")
4. Click **"Add a variable"**
5. For each variable:
   - **Key**: `REACT_APP_GOOGLE_API_KEY`
   - **Value**: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Click **"Create variable"**
6. Repeat for all three variables

**Important:** After adding environment variables, you must **redeploy** your site:
- Go to **"Deploys"** tab
- Click **"Trigger deploy" → "Deploy site"**

---

## 🧪 Test Your Environment Variables

### Test Locally

1. Start your dev server:
```bash
npm start
```

2. Open browser console (F12) and type:
```javascript
console.log(process.env.REACT_APP_GOOGLE_API_KEY)
```

You should see your API key (not `undefined`).

3. Try running an audit on a website - if it works, you're good!

### Test on Netlify

1. After deploying, visit your Netlify site
2. Open browser console (F12)
3. Try running an audit
4. If you see API errors, check that:
   - Environment variables are set in Netlify dashboard
   - You redeployed after adding them
   - Variable names start with `REACT_APP_`

---

## 🔒 Security Best Practices

### ✅ DO:
- Store API keys in environment variables (`.env` or Netlify dashboard)
- Restrict your Google API key to specific APIs
- Add HTTP referrer restrictions for production
- Keep your `.env` file in `.gitignore`

### ❌ DON'T:
- Hardcode API keys in your code
- Commit `.env` file to git
- Share your API keys publicly
- Use unrestricted API keys in production

---

## 🆘 Troubleshooting

### "API Key Invalid" Error

**Problem:** Google API returns 400 or 403 error

**Solutions:**
1. Check API key is correct (no extra spaces)
2. Verify PageSpeed Insights API is enabled
3. Wait 5-10 minutes after creating key (propagation delay)
4. Check API restrictions aren't blocking your domain
5. Verify billing is enabled (Google requires it even for free tier)

### Environment Variables Not Loading

**Problem:** `process.env.REACT_APP_GOOGLE_API_KEY` is `undefined`

**Solutions:**
1. Verify variable name starts with `REACT_APP_`
2. Restart dev server after creating `.env`
3. Check `.env` file is in project root (not in `src/`)
4. No quotes needed in `.env` file
5. For Netlify: redeploy after adding variables

### Zapier Webhook Not Receiving Data

**Problem:** No data appears in Zapier

**Solutions:**
1. Test webhook URL with browser fetch (see Step 5 above)
2. Check webhook URL is complete and correct
3. Verify Zap is turned ON
4. Check Zapier task history for errors
5. Free plan limited to 100 tasks/month - check quota

---

## 📋 Quick Reference

### Minimum Required (to deploy):
```env
REACT_APP_GOOGLE_API_KEY=your_key_here
```

### Full Configuration (all features):
```env
REACT_APP_GOOGLE_API_KEY=your_key_here
REACT_APP_ZAPIER_WEBHOOK=https://hooks.zapier.com/hooks/catch/xxxxx
REACT_APP_BOOKING_LINK=https://calendly.com/your-link
```

### Where to Get Them:
- **Google API Key**: [console.cloud.google.com](https://console.cloud.google.com/)
- **Zapier Webhook**: [zapier.com/app/zaps](https://zapier.com/app/zaps)
- **Booking Link**: [calendly.com](https://calendly.com/) (or your own)

---

## ✅ Checklist

Before deploying, make sure you have:

- [ ] Google API Key created and copied
- [ ] PageSpeed Insights API enabled
- [ ] Search Console API enabled
- [ ] API key restrictions configured
- [ ] Zapier webhook created (if using email capture)
- [ ] Booking link ready (if using consultations)
- [ ] `.env` file created locally (for testing)
- [ ] Environment variables added to Netlify dashboard
- [ ] Tested locally with `npm start`

---

You're now ready to deploy! 🚀

Return to **DEPLOYMENT.md** for deployment instructions.
