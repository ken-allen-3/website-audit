# ⚡ Quick Start - Get Your API Keys in 5 Minutes

Super simple instructions to get your Website Audit Tool running!

---

## Step 1: Get Google API Key (2 minutes)

### Quick Steps:

1. **Go to**: [console.cloud.google.com](https://console.cloud.google.com/)

2. **Create a project**: Click project dropdown → "New Project" → Name it → "Create"

3. **Enable APIs**:
   - Search for "PageSpeed Insights API" → Click it → "Enable"
   - Search for "Search Console API" → Click it → "Enable"

4. **Create API Key**:
   - Click ☰ menu → "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "API key"
   - **Copy your key!** (looks like `AIzaSyD...`)

5. **Restrict it** (important!):
   - Click "EDIT API KEY"
   - Under "API restrictions" → Check only:
     - PageSpeed Insights API
     - Search Console API
   - Click "Save"

✅ **You now have**: `REACT_APP_GOOGLE_API_KEY`

---

## Step 2: Get Zapier Webhook (2 minutes) - OPTIONAL

### Quick Steps:

1. **Go to**: [zapier.com/app/zaps](https://zapier.com/app/zaps)

2. **Click**: "Create Zap"

3. **Trigger**:
   - Search "Webhooks by Zapier" → Select it
   - Choose "Catch Hook" → Continue
   - **Copy the webhook URL!** (looks like `https://hooks.zapier.com/hooks/catch/...`)

4. **Action** (what to do with the data):
   - Click "+" to add action
   - Choose "Email by Zapier" or "Google Sheets" or your CRM
   - Map the fields (name, email, auditResults, etc.)
   - Turn on the Zap

✅ **You now have**: `REACT_APP_ZAPIER_WEBHOOK`

---

## Step 3: Get Booking Link (30 seconds) - OPTIONAL

Just use any link:

- **Calendly**: [calendly.com](https://calendly.com/) - Create free account → Copy your link
- **Google Calendar**: Use appointment scheduling
- **Your website**: `https://yoursite.com/contact`
- **Email**: `mailto:you@email.com`

✅ **You now have**: `REACT_APP_BOOKING_LINK`

---

## Step 4: Add to Netlify (1 minute)

### In Netlify Dashboard:

1. Go to your site → **Site settings** → **Environment variables**

2. Click **"Add a variable"** and add each one:

```
Key: REACT_APP_GOOGLE_API_KEY
Value: AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Key: REACT_APP_ZAPIER_WEBHOOK
Value: https://hooks.zapier.com/hooks/catch/123456/xxxxxx/

Key: REACT_APP_BOOKING_LINK
Value: https://calendly.com/your-name/consultation
```

3. **Redeploy**: Go to "Deploys" → "Trigger deploy" → "Deploy site"

---

## OR: Test Locally First

### Create `.env` file:

In your project root, create a file named `.env`:

```env
REACT_APP_GOOGLE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_ZAPIER_WEBHOOK=https://hooks.zapier.com/hooks/catch/123456/xxxxxx/
REACT_APP_BOOKING_LINK=https://calendly.com/your-name/consultation
```

### Run locally:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) and test!

---

## 🎯 That's It!

You now have all three environment variables:

- ✅ `REACT_APP_GOOGLE_API_KEY` - For audits
- ✅ `REACT_APP_ZAPIER_WEBHOOK` - For email capture
- ✅ `REACT_APP_BOOKING_LINK` - For consultations

Ready to deploy? See **DEPLOYMENT.md**

---

## 🆘 Quick Troubleshooting

**"API Key Invalid"**
- Wait 5-10 minutes after creating (propagation time)
- Check both APIs are enabled
- Verify key copied correctly

**"Environment variables not working"**
- Must start with `REACT_APP_`
- Redeploy after adding to Netlify
- Restart dev server after creating `.env`

**"Webhook not receiving data"**
- Check Zap is turned ON
- Verify webhook URL is complete
- Test with browser fetch (see ENVIRONMENT_SETUP.md)

---

## 📚 Need More Help?

See **ENVIRONMENT_SETUP.md** for detailed step-by-step instructions with troubleshooting.

---

**Total time**: ~5 minutes to get all keys and deploy! 🚀
