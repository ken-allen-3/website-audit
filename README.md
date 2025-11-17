# Website Audit Tool

A production-ready React component that provides real-time website analysis including page speed, SEO health, mobile experience, accessibility, and security checks.

![Website Audit Tool](https://img.shields.io/badge/React-Component-blue)
![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-green)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

## Features

✅ **Comprehensive Analysis**
- Page Speed (Google PageSpeed Insights API)
- SEO Health (meta tags, headings, alt text, etc.)
- Mobile Experience (Google Mobile-Friendly Test API)
- Accessibility (WCAG compliance checks)
- Security (HTTPS, security headers)

✅ **User Experience**
- Clean, modern UI with smooth animations
- Real-time loading progress indicators
- Color-coded scores and grades
- Detailed issue breakdown with severity levels
- Responsive design (mobile-first)

✅ **Lead Generation**
- Email capture for detailed PDF reports
- Zapier webhook integration
- Customizable booking/consultation links

✅ **Production Features**
- Error handling and graceful degradation
- URL normalization and validation
- Parallel API calls for fast results
- No external dependencies beyond React
- Console error-free

## Deployment

### Deploy to Netlify (Recommended)

This project is ready for one-click deployment to Netlify!

#### Option 1: Deploy from GitHub

1. **Push your code to GitHub** (if not already done)

2. **Go to [Netlify](https://www.netlify.com/)** and sign in

3. **Click "Add new site" → "Import an existing project"**

4. **Connect your GitHub repository**

5. **Configure build settings** (Netlify should auto-detect these):
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: `18`

6. **Add environment variables** in Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add:
     - `REACT_APP_GOOGLE_API_KEY`: Your Google API key
     - `REACT_APP_ZAPIER_WEBHOOK`: Your Zapier webhook URL
     - `REACT_APP_BOOKING_LINK`: Your booking/calendar link

7. **Click "Deploy site"**

Your site will be live at a Netlify URL (e.g., `https://your-site-name.netlify.app`)

#### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (from project root)
netlify deploy --prod
```

#### Option 3: Drag & Drop Deploy

```bash
# Build the project locally
npm install
npm run build

# Drag and drop the 'build' folder to Netlify's deploy page
# https://app.netlify.com/drop
```

## Quick Start

### 1. Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your API keys
# Then start development server
npm start
```

The app will open at `http://localhost:3000`

### 2. Environment Setup

Create a `.env` file in your project root:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here
REACT_APP_ZAPIER_WEBHOOK=https://hooks.zapier.com/hooks/catch/your_webhook_url
REACT_APP_BOOKING_LINK=https://calendly.com/your-link
```

### 3. Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - PageSpeed Insights API
   - Search Console API (for Mobile-Friendly Test)
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

**Important:** Restrict your API key to only these APIs and your domain in production.

### 4. Set Up Zapier Webhook

1. Create a new Zap in [Zapier](https://zapier.com/)
2. Choose "Webhooks by Zapier" as the trigger
3. Select "Catch Hook"
4. Copy the webhook URL
5. Add actions to your Zap:
   - Send email with audit results
   - Add to CRM
   - Create PDF report
   - etc.

### 5. Use the Component

```jsx
import React from 'react';
import WebsiteAuditTool from './components/WebsiteAuditTool';

function App() {
  return (
    <div className="App">
      <WebsiteAuditTool />
    </div>
  );
}

export default App;
```

## Component Architecture

### State Management

The component uses React hooks for state management:

- `screen`: Current UI screen (input, loading, results, email, thankyou)
- `businessName`: User's business name
- `website`: Website URL to audit
- `name` & `email`: Contact information for report delivery
- `loadingProgress`: Track progress of each audit check
- `auditResults`: All audit scores, grades, and issues

### API Integrations

#### 1. Google PageSpeed Insights
- **Endpoint:** `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
- **Returns:** Performance score (0-100), Core Web Vitals (FCP, LCP, CLS)
- **Usage:** Analyzes page load speed and performance metrics

#### 2. Google Mobile-Friendly Test
- **Endpoint:** `https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run`
- **Returns:** Mobile-friendly status and issues
- **Fallback:** Checks for viewport meta tag if API fails

#### 3. Manual SEO Checks
Fetches HTML and analyzes:
- Title tag (length 30-60 chars)
- Meta description (length 120-160 chars)
- H1 heading (should have exactly one)
- Internal links (minimum 3 recommended)
- Image alt attributes (80%+ coverage)
- Viewport meta tag

#### 4. Manual Accessibility Checks
- Lang attribute on `<html>`
- Heading hierarchy (H1, H2, etc.)
- Image alt text coverage (90%+ required)
- Form label associations
- Skip navigation links
- ARIA landmark roles

#### 5. Manual Security Checks
- HTTPS enforcement
- Strict-Transport-Security header
- X-Content-Type-Options header
- X-Frame-Options or CSP frame-ancestors

### Scoring System

**Individual Scores:** 0-100 for each category

**Overall Score Formula:**
```
Overall = (Speed × 0.25) + (SEO × 0.25) + (Mobile × 0.20) + (Accessibility × 0.15) + (Security × 0.15)
```

**Grading Scale:**
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: <60

**Color Coding:**
- Green (#4CAF50): Score ≥ 80
- Orange (#FF9800): Score 60-79
- Red (#F44336): Score < 60

## UI Screens

### 1. Input Screen
- Business name input
- Website URL input
- Validation and error messages

### 2. Loading Screen
- Animated progress for each check
- Real-time status updates
- Loading spinner

### 3. Results Screen
- Overall score with grade
- Individual category scores with progress bars
- Core Web Vitals metrics
- Detailed issue list with severity levels
- CTA to get PDF report

### 4. Email Capture Screen
- Name and email fields
- Validation
- Submit to Zapier webhook

### 5. Thank You Screen
- Success confirmation
- Next steps
- Booking link CTA
- Option to audit another site

## Zapier Webhook Data Structure

When a user submits their email, the following JSON is sent to your Zapier webhook:

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "businessName": "Acme Corp",
  "website": "https://acmecorp.com",
  "auditResults": {
    "speed": 45,
    "seo": 62,
    "mobile": 78,
    "accessibility": 71,
    "security": 89,
    "overall": 69,
    "grade": "C",
    "issues": [
      {
        "category": "Speed",
        "severity": "high",
        "message": "Page load speed is critically slow"
      },
      {
        "category": "SEO",
        "severity": "medium",
        "message": "Meta description length (95 chars) should be 120-160 characters"
      }
    ]
  }
}
```

## Customization

### Colors

Edit CSS variables in `WebsiteAuditTool.css`:

```css
:root {
  --primary-blue: #2563eb;
  --success-green: #4CAF50;
  --warning-orange: #FF9800;
  --danger-red: #F44336;
  /* ... more variables */
}
```

### Scoring Weights

Modify the formula in `runAudit()` function (line ~420):

```javascript
const overall = Math.round(
  speedResult.score * 0.25 +
  seoResult.score * 0.25 +
  mobileResult.score * 0.20 +
  accessibilityResult.score * 0.15 +
  securityResult.score * 0.15
);
```

### Add More Checks

Add new checks to the respective functions:
- `checkSEO()` - Add more SEO rules
- `checkAccessibility()` - Add WCAG criteria
- `checkSecurity()` - Add security headers

## CORS Considerations

### Development

The component uses a CORS proxy (`api.allorigins.win`) as a fallback for fetching HTML content. This works for development but has rate limits.

### Production

For production, set up a backend proxy:

```javascript
// Example Express.js proxy endpoint
app.get('/api/fetch-html', async (req, res) => {
  const { url } = req.query;
  const response = await fetch(url);
  const html = await response.text();
  res.send(html);
});
```

Update `fetchHtml()` function to use your backend:

```javascript
const fetchHtml = async (url) => {
  const response = await fetch(`/api/fetch-html?url=${encodeURIComponent(url)}`);
  return await response.text();
};
```

## Error Handling

The component gracefully handles:

- Invalid URLs
- API failures (provides fallback checks)
- CORS errors (uses proxy)
- Network timeouts
- Invalid email formats
- Missing form fields

## Performance Optimization

- **Parallel API calls** using `Promise.all()`
- **Optimized animations** with CSS transitions
- **Reduced motion support** for accessibility
- **Lazy loading** ready (can wrap in `React.lazy()`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Best Practices

1. **API Key Protection**
   - Use environment variables (never commit `.env`)
   - Restrict API keys to specific domains in production
   - Enable API usage limits

2. **Input Validation**
   - All URLs are validated and normalized
   - Email validation before submission
   - XSS protection (React escapes by default)

3. **Rate Limiting**
   - Consider implementing rate limiting on your backend
   - Google APIs have built-in rate limits

## Deployment Checklist

- [ ] Add your Google API key to environment variables
- [ ] Configure Zapier webhook
- [ ] Set up backend proxy for HTML fetching (recommended)
- [ ] Test on multiple devices and browsers
- [ ] Enable HTTPS on your domain
- [ ] Configure CSP headers
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Add analytics tracking
- [ ] Test email delivery flow
- [ ] Verify booking link works

## Troubleshooting

### "API Key Invalid" Error
- Verify API key in `.env` file
- Check that PageSpeed Insights API is enabled
- Ensure API key restrictions allow your domain

### CORS Errors
- Use the CORS proxy for development
- Set up a backend proxy for production
- Check browser console for specific CORS errors

### No Results Displayed
- Check browser console for errors
- Verify the website URL is accessible
- Test with a simple website first (e.g., example.com)

### Zapier Webhook Not Receiving Data
- Test webhook URL with Postman
- Check Zapier dashboard for webhook history
- Verify webhook URL in `.env` is correct

## License

MIT License - feel free to use in your projects!

## Support

For issues or questions:
1. Check the browser console for errors
2. Review this README
3. Test with the provided examples
4. Check API quotas and limits

## Changelog

### v1.0.0 (2024)
- Initial release
- Google PageSpeed Insights integration
- Mobile-Friendly Test integration
- Manual SEO, Accessibility, and Security checks
- Email capture with Zapier
- Responsive design
- Production-ready error handling

---

Built with ❤️ using React
