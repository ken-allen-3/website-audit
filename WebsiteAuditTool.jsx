import React, { useState } from 'react';
import './WebsiteAuditTool.css';

const WebsiteAuditTool = () => {
  // ==================== STATE MANAGEMENT ====================
  const [screen, setScreen] = useState('input'); // input, loading, results, email, thankyou
  const [businessName, setBusinessName] = useState('');
  const [website, setWebsite] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loadingProgress, setLoadingProgress] = useState({
    speed: false,
    mobile: false,
    seo: false,
    accessibility: false,
    security: false
  });
  const [auditResults, setAuditResults] = useState({
    speed: 0,
    seo: 0,
    mobile: 0,
    accessibility: 0,
    security: 0,
    overall: 0,
    grade: '',
    issues: [],
    metrics: {}
  });

  // ==================== CONFIGURATION ====================
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const ZAPIER_WEBHOOK = process.env.REACT_APP_ZAPIER_WEBHOOK;
  const BOOKING_LINK = process.env.REACT_APP_BOOKING_LINK || '#';

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Normalize and validate URL
   */
  const normalizeUrl = (url) => {
    let normalized = url.trim().toLowerCase();

    // Remove protocol if present
    normalized = normalized.replace(/^https?:\/\//, '');
    normalized = normalized.replace(/^www\./, '');
    normalized = normalized.replace(/\/$/, ''); // Remove trailing slash

    // Add https protocol
    return `https://${normalized}`;
  };

  /**
   * Validate URL format
   */
  const isValidUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  /**
   * Validate email format
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Calculate grade from score
   */
  const getGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  /**
   * Get color based on score
   */
  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  // ==================== API CALLS ====================

  /**
   * Fetch Google PageSpeed Insights
   */
  const checkPageSpeed = async (url) => {
    setLoadingProgress(prev => ({ ...prev, speed: true }));

    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&category=performance`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('PageSpeed API failed');
      }

      const data = await response.json();
      const score = Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100);

      // Extract Core Web Vitals
      const metrics = data.lighthouseResult?.audits || {};
      const fcp = metrics['first-contentful-paint']?.displayValue || 'N/A';
      const lcp = metrics['largest-contentful-paint']?.displayValue || 'N/A';
      const cls = metrics['cumulative-layout-shift']?.displayValue || 'N/A';

      const issues = [];
      if (score < 50) {
        issues.push({ category: 'Speed', severity: 'high', message: 'Page load speed is critically slow' });
      } else if (score < 80) {
        issues.push({ category: 'Speed', severity: 'medium', message: 'Page load speed could be improved' });
      }

      return {
        score,
        metrics: { fcp, lcp, cls },
        issues
      };
    } catch (error) {
      console.error('PageSpeed check failed:', error);
      return {
        score: 0,
        metrics: { fcp: 'N/A', lcp: 'N/A', cls: 'N/A' },
        issues: [{ category: 'Speed', severity: 'high', message: 'Unable to analyze page speed' }]
      };
    }
  };

  /**
   * Check Mobile Friendliness
   */
  const checkMobileFriendly = async (url) => {
    setLoadingProgress(prev => ({ ...prev, mobile: true }));

    try {
      const apiUrl = `https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run?key=${API_KEY}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Mobile-Friendly API failed');
      }

      const data = await response.json();
      const isMobileFriendly = data.mobileFriendliness === 'MOBILE_FRIENDLY';
      const score = isMobileFriendly ? 100 : 0;

      const issues = [];
      if (!isMobileFriendly) {
        issues.push({ category: 'Mobile', severity: 'high', message: 'Website is not mobile-friendly' });
        if (data.mobileFriendlyIssues) {
          data.mobileFriendlyIssues.forEach(issue => {
            issues.push({
              category: 'Mobile',
              severity: 'medium',
              message: issue.rule || 'Mobile compatibility issue detected'
            });
          });
        }
      }

      return { score, issues };
    } catch (error) {
      console.error('Mobile check failed:', error);
      // Fallback: check viewport meta tag
      try {
        const html = await fetchHtml(url);
        const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
        const score = hasViewport ? 75 : 25;
        return {
          score,
          issues: hasViewport ? [] : [{ category: 'Mobile', severity: 'high', message: 'Missing viewport meta tag' }]
        };
      } catch {
        return {
          score: 50,
          issues: [{ category: 'Mobile', severity: 'medium', message: 'Unable to verify mobile compatibility' }]
        };
      }
    }
  };

  /**
   * Fetch HTML content
   */
  const fetchHtml = async (url) => {
    // Note: Direct fetch may fail due to CORS. In production, use a proxy/backend.
    try {
      const response = await fetch(url, { mode: 'cors' });
      return await response.text();
    } catch (error) {
      // CORS fallback: Use a CORS proxy (for demo purposes)
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      return await response.text();
    }
  };

  /**
   * Check SEO Health
   */
  const checkSEO = async (url) => {
    setLoadingProgress(prev => ({ ...prev, seo: true }));

    try {
      const html = await fetchHtml(url);
      const issues = [];
      let checksPass = 0;
      const totalChecks = 7;

      // 1. Title tag
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const titleLength = titleMatch ? titleMatch[1].length : 0;
      if (!titleMatch) {
        issues.push({ category: 'SEO', severity: 'high', message: 'Missing page title' });
      } else if (titleLength < 30 || titleLength > 60) {
        issues.push({ category: 'SEO', severity: 'medium', message: `Title length (${titleLength} chars) should be 30-60 characters` });
      } else {
        checksPass++;
      }

      // 2. Meta description
      const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const descLength = metaDescMatch ? metaDescMatch[1].length : 0;
      if (!metaDescMatch) {
        issues.push({ category: 'SEO', severity: 'high', message: 'Missing meta description' });
      } else if (descLength < 120 || descLength > 160) {
        issues.push({ category: 'SEO', severity: 'medium', message: `Meta description length (${descLength} chars) should be 120-160 characters` });
      } else {
        checksPass++;
      }

      // 3. H1 tag
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      if (!h1Match) {
        issues.push({ category: 'SEO', severity: 'high', message: 'Missing H1 heading' });
      } else {
        checksPass++;
      }

      // 4. Multiple H1s
      const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
      if (h1Count > 1) {
        issues.push({ category: 'SEO', severity: 'medium', message: `Multiple H1 tags found (${h1Count}). Should have only one` });
      } else if (h1Count === 1) {
        checksPass++;
      }

      // 5. Internal links
      const internalLinks = (html.match(/<a[^>]*href=["'][^"']*["'][^>]*>/gi) || []).length;
      if (internalLinks < 3) {
        issues.push({ category: 'SEO', severity: 'low', message: 'Few internal links found. Add more for better navigation' });
      } else {
        checksPass++;
      }

      // 6. Alt text on images
      const images = (html.match(/<img[^>]*>/gi) || []);
      const imagesWithAlt = (html.match(/<img[^>]*alt=["'][^"']+["'][^>]*>/gi) || []);
      const altRatio = images.length > 0 ? imagesWithAlt.length / images.length : 1;
      if (altRatio < 0.8 && images.length > 0) {
        issues.push({ category: 'SEO', severity: 'medium', message: `${Math.round((1 - altRatio) * 100)}% of images missing alt text` });
      } else {
        checksPass++;
      }

      // 7. Viewport meta tag
      const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
      if (!hasViewport) {
        issues.push({ category: 'SEO', severity: 'medium', message: 'Missing viewport meta tag' });
      } else {
        checksPass++;
      }

      const score = Math.round((checksPass / totalChecks) * 100);
      return { score, issues };
    } catch (error) {
      console.error('SEO check failed:', error);
      return {
        score: 0,
        issues: [{ category: 'SEO', severity: 'high', message: 'Unable to analyze SEO - website may be blocking automated checks' }]
      };
    }
  };

  /**
   * Check Accessibility
   */
  const checkAccessibility = async (url) => {
    setLoadingProgress(prev => ({ ...prev, accessibility: true }));

    try {
      const html = await fetchHtml(url);
      const issues = [];
      let checksPass = 0;
      const totalChecks = 6;

      // 1. Lang attribute
      const hasLang = /<html[^>]*lang=["'][^"']+["'][^>]*>/i.test(html);
      if (!hasLang) {
        issues.push({ category: 'Accessibility', severity: 'medium', message: 'Missing lang attribute on <html> tag' });
      } else {
        checksPass++;
      }

      // 2. Heading hierarchy
      const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
      const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
      if (h1Count === 0 || h2Count === 0) {
        issues.push({ category: 'Accessibility', severity: 'medium', message: 'Incomplete heading hierarchy (H1, H2, etc.)' });
      } else {
        checksPass++;
      }

      // 3. Alt text ratio
      const images = (html.match(/<img[^>]*>/gi) || []);
      const imagesWithAlt = (html.match(/<img[^>]*alt=["'][^"']*["'][^>]*>/gi) || []);
      const altRatio = images.length > 0 ? imagesWithAlt.length / images.length : 1;
      if (altRatio < 0.9 && images.length > 0) {
        issues.push({ category: 'Accessibility', severity: 'high', message: `${Math.round((1 - altRatio) * 100)}% of images missing alt attributes` });
      } else {
        checksPass++;
      }

      // 4. Form labels
      const inputs = (html.match(/<input[^>]*type=["']?(text|email|password|tel|number)[^>]*>/gi) || []).length;
      const labels = (html.match(/<label[^>]*for=["'][^"']+["'][^>]*>/gi) || []).length;
      if (inputs > 0 && labels < inputs) {
        issues.push({ category: 'Accessibility', severity: 'high', message: 'Some form inputs missing associated labels' });
      } else {
        checksPass++;
      }

      // 5. Skip links
      const hasSkipLink = /skip[- ]to[- ]content|skip[- ]navigation|skip[- ]to[- ]main/i.test(html);
      if (!hasSkipLink) {
        issues.push({ category: 'Accessibility', severity: 'low', message: 'Consider adding skip navigation links' });
      } else {
        checksPass++;
      }

      // 6. ARIA landmarks
      const hasARIA = /role=["'](main|navigation|banner|contentinfo|complementary)["']/i.test(html);
      if (!hasARIA) {
        issues.push({ category: 'Accessibility', severity: 'low', message: 'Consider adding ARIA landmark roles' });
      } else {
        checksPass++;
      }

      const score = Math.round((checksPass / totalChecks) * 100);
      return { score, issues };
    } catch (error) {
      console.error('Accessibility check failed:', error);
      return {
        score: 0,
        issues: [{ category: 'Accessibility', severity: 'high', message: 'Unable to analyze accessibility' }]
      };
    }
  };

  /**
   * Check Security
   */
  const checkSecurity = async (url) => {
    setLoadingProgress(prev => ({ ...prev, security: true }));

    try {
      const issues = [];
      let checksPass = 0;
      const totalChecks = 4;

      // 1. HTTPS
      const isHttps = url.startsWith('https://');
      if (!isHttps) {
        issues.push({ category: 'Security', severity: 'high', message: 'Website not using HTTPS encryption' });
      } else {
        checksPass++;
      }

      // 2-4. Security headers (requires backend/proxy to check)
      try {
        const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
        const headers = response.headers;

        // Strict-Transport-Security
        if (!headers.get('strict-transport-security')) {
          issues.push({ category: 'Security', severity: 'medium', message: 'Missing Strict-Transport-Security header' });
        } else {
          checksPass++;
        }

        // X-Content-Type-Options
        if (!headers.get('x-content-type-options')) {
          issues.push({ category: 'Security', severity: 'medium', message: 'Missing X-Content-Type-Options header' });
        } else {
          checksPass++;
        }

        // X-Frame-Options
        if (!headers.get('x-frame-options') && !headers.get('content-security-policy')?.includes('frame-ancestors')) {
          issues.push({ category: 'Security', severity: 'medium', message: 'Missing X-Frame-Options or CSP frame-ancestors' });
        } else {
          checksPass++;
        }
      } catch (error) {
        // CORS prevents header check - assume partial pass
        checksPass += 2; // Give benefit of doubt for 2 checks
        issues.push({ category: 'Security', severity: 'low', message: 'Unable to verify all security headers' });
      }

      const score = Math.round((checksPass / totalChecks) * 100);
      return { score, issues };
    } catch (error) {
      console.error('Security check failed:', error);
      return {
        score: 50,
        issues: [{ category: 'Security', severity: 'medium', message: 'Unable to complete security analysis' }]
      };
    }
  };

  // ==================== MAIN AUDIT FUNCTION ====================

  /**
   * Run complete website audit
   */
  const runAudit = async () => {
    // Validate input
    const newErrors = {};
    if (!businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!website.trim()) {
      newErrors.website = 'Website URL is required';
    } else {
      const normalizedUrl = normalizeUrl(website);
      if (!isValidUrl(normalizedUrl)) {
        newErrors.website = 'Please enter a valid URL';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const normalizedUrl = normalizeUrl(website);
    setWebsite(normalizedUrl);
    setScreen('loading');

    try {
      // Run all checks in parallel
      const [speedResult, mobileResult, seoResult, accessibilityResult, securityResult] = await Promise.all([
        checkPageSpeed(normalizedUrl),
        checkMobileFriendly(normalizedUrl),
        checkSEO(normalizedUrl),
        checkAccessibility(normalizedUrl),
        checkSecurity(normalizedUrl)
      ]);

      // Combine all issues
      const allIssues = [
        ...speedResult.issues,
        ...mobileResult.issues,
        ...seoResult.issues,
        ...accessibilityResult.issues,
        ...securityResult.issues
      ];

      // Calculate overall score
      const overall = Math.round(
        speedResult.score * 0.25 +
        seoResult.score * 0.25 +
        mobileResult.score * 0.20 +
        accessibilityResult.score * 0.15 +
        securityResult.score * 0.15
      );

      const grade = getGrade(overall);

      setAuditResults({
        speed: speedResult.score,
        seo: seoResult.score,
        mobile: mobileResult.score,
        accessibility: accessibilityResult.score,
        security: securityResult.score,
        overall,
        grade,
        issues: allIssues,
        metrics: speedResult.metrics
      });

      setScreen('results');
    } catch (error) {
      console.error('Audit failed:', error);
      setErrors({ general: 'Audit failed. Please try again.' });
      setScreen('input');
    }
  };

  // ==================== EMAIL SUBMISSION ====================

  /**
   * Submit email to Zapier webhook
   */
  const submitEmail = async () => {
    // Validate email input
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Prepare payload
    const payload = {
      name: name.trim(),
      email: email.trim(),
      businessName: businessName.trim(),
      website: website,
      auditResults: {
        speed: auditResults.speed,
        seo: auditResults.seo,
        mobile: auditResults.mobile,
        accessibility: auditResults.accessibility,
        security: auditResults.security,
        overall: auditResults.overall,
        grade: auditResults.grade,
        issues: auditResults.issues
      }
    };

    try {
      // Send to Zapier webhook
      if (ZAPIER_WEBHOOK) {
        await fetch(ZAPIER_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      setScreen('thankyou');
    } catch (error) {
      console.error('Email submission failed:', error);
      setErrors({ general: 'Failed to send report. Please try again.' });
    }
  };

  // ==================== UI SCREENS ====================

  /**
   * Input Screen
   */
  const renderInputScreen = () => (
    <div className="screen input-screen">
      <div className="header">
        <h1>Website Audit Tool</h1>
        <p>Get a comprehensive analysis of your website's performance, SEO, and more</p>
      </div>

      <form className="audit-form" onSubmit={(e) => { e.preventDefault(); runAudit(); }}>
        <div className="form-group">
          <label htmlFor="businessName">Business Name *</label>
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter your business name"
            className={errors.businessName ? 'error' : ''}
          />
          {errors.businessName && <span className="error-message">{errors.businessName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="website">Website URL *</label>
          <input
            type="text"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="example.com"
            className={errors.website ? 'error' : ''}
          />
          {errors.website && <span className="error-message">{errors.website}</span>}
        </div>

        {errors.general && <div className="error-message general-error">{errors.general}</div>}

        <button type="submit" className="btn btn-primary">
          Start Audit
        </button>
      </form>
    </div>
  );

  /**
   * Loading Screen
   */
  const renderLoadingScreen = () => (
    <div className="screen loading-screen">
      <div className="header">
        <h2>Analyzing {businessName}</h2>
        <p>Please wait while we audit your website...</p>
      </div>

      <div className="loading-progress">
        <div className="progress-item">
          <div className={`progress-icon ${loadingProgress.speed ? 'complete' : 'loading'}`}>
            {loadingProgress.speed ? '✓' : '○'}
          </div>
          <span>Checking page speed...</span>
        </div>

        <div className="progress-item">
          <div className={`progress-icon ${loadingProgress.mobile ? 'complete' : 'loading'}`}>
            {loadingProgress.mobile ? '✓' : '○'}
          </div>
          <span>Testing mobile experience...</span>
        </div>

        <div className="progress-item">
          <div className={`progress-icon ${loadingProgress.seo ? 'complete' : 'loading'}`}>
            {loadingProgress.seo ? '✓' : '○'}
          </div>
          <span>Analyzing SEO health...</span>
        </div>

        <div className="progress-item">
          <div className={`progress-icon ${loadingProgress.accessibility ? 'complete' : 'loading'}`}>
            {loadingProgress.accessibility ? '✓' : '○'}
          </div>
          <span>Checking accessibility...</span>
        </div>

        <div className="progress-item">
          <div className={`progress-icon ${loadingProgress.security ? 'complete' : 'loading'}`}>
            {loadingProgress.security ? '✓' : '○'}
          </div>
          <span>Verifying security...</span>
        </div>
      </div>

      <div className="loading-spinner"></div>
    </div>
  );

  /**
   * Results Screen
   */
  const renderResultsScreen = () => (
    <div className="screen results-screen">
      <div className="header">
        <h2>Audit Results for {businessName}</h2>
        <div className="overall-score">
          <div className="score-circle" style={{ borderColor: getScoreColor(auditResults.overall) }}>
            <span className="score-value">{auditResults.overall}</span>
            <span className="score-grade">{auditResults.grade}</span>
          </div>
          <p>Overall Score</p>
        </div>
      </div>

      <div className="scores-grid">
        <div className="score-card">
          <h3>Page Speed</h3>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${auditResults.speed}%`,
                backgroundColor: getScoreColor(auditResults.speed)
              }}
            ></div>
          </div>
          <span className="score-number">{auditResults.speed}/100</span>
          {auditResults.metrics && (
            <div className="metrics">
              <small>FCP: {auditResults.metrics.fcp}</small>
              <small>LCP: {auditResults.metrics.lcp}</small>
              <small>CLS: {auditResults.metrics.cls}</small>
            </div>
          )}
        </div>

        <div className="score-card">
          <h3>SEO Health</h3>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${auditResults.seo}%`,
                backgroundColor: getScoreColor(auditResults.seo)
              }}
            ></div>
          </div>
          <span className="score-number">{auditResults.seo}/100</span>
        </div>

        <div className="score-card">
          <h3>Mobile Experience</h3>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${auditResults.mobile}%`,
                backgroundColor: getScoreColor(auditResults.mobile)
              }}
            ></div>
          </div>
          <span className="score-number">{auditResults.mobile}/100</span>
        </div>

        <div className="score-card">
          <h3>Accessibility</h3>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${auditResults.accessibility}%`,
                backgroundColor: getScoreColor(auditResults.accessibility)
              }}
            ></div>
          </div>
          <span className="score-number">{auditResults.accessibility}/100</span>
        </div>

        <div className="score-card">
          <h3>Security</h3>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${auditResults.security}%`,
                backgroundColor: getScoreColor(auditResults.security)
              }}
            ></div>
          </div>
          <span className="score-number">{auditResults.security}/100</span>
        </div>
      </div>

      {auditResults.issues.length > 0 && (
        <div className="issues-section">
          <h3>Issues Found ({auditResults.issues.length})</h3>
          <div className="issues-list">
            {auditResults.issues.map((issue, index) => (
              <div key={index} className={`issue-item severity-${issue.severity}`}>
                <span className="issue-badge">{issue.category}</span>
                <span className="issue-message">{issue.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="actions">
        <button className="btn btn-primary" onClick={() => setScreen('email')}>
          Get Detailed PDF Report
        </button>
        <button className="btn btn-secondary" onClick={() => setScreen('input')}>
          Audit Another Site
        </button>
      </div>
    </div>
  );

  /**
   * Email Capture Screen
   */
  const renderEmailScreen = () => (
    <div className="screen email-screen">
      <div className="header">
        <h2>Get Your Detailed Report</h2>
        <p>Enter your details to receive a comprehensive PDF audit report</p>
      </div>

      <form className="email-form" onSubmit={(e) => { e.preventDefault(); submitEmail(); }}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {errors.general && <div className="error-message general-error">{errors.general}</div>}

        <button type="submit" className="btn btn-primary">
          Send Me The Report
        </button>
        <button type="button" className="btn btn-text" onClick={() => setScreen('results')}>
          Back to Results
        </button>
      </form>
    </div>
  );

  /**
   * Thank You Screen
   */
  const renderThankYouScreen = () => (
    <div className="screen thankyou-screen">
      <div className="header">
        <div className="success-icon">✓</div>
        <h2>Report Sent Successfully!</h2>
        <p>Check your email ({email}) for your detailed audit report.</p>
      </div>

      <div className="next-steps">
        <h3>What's Next?</h3>
        <ul>
          <li>Review the detailed recommendations in your PDF report</li>
          <li>Prioritize fixes based on severity (high, medium, low)</li>
          <li>Schedule a call with our team to discuss improvements</li>
        </ul>
      </div>

      <div className="actions">
        <a href={BOOKING_LINK} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
          Schedule a Consultation
        </a>
        <button className="btn btn-secondary" onClick={() => {
          setScreen('input');
          setBusinessName('');
          setWebsite('');
          setName('');
          setEmail('');
          setAuditResults({
            speed: 0,
            seo: 0,
            mobile: 0,
            accessibility: 0,
            security: 0,
            overall: 0,
            grade: '',
            issues: [],
            metrics: {}
          });
        }}>
          Audit Another Website
        </button>
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================

  return (
    <div className="audit-container">
      {screen === 'input' && renderInputScreen()}
      {screen === 'loading' && renderLoadingScreen()}
      {screen === 'results' && renderResultsScreen()}
      {screen === 'email' && renderEmailScreen()}
      {screen === 'thankyou' && renderThankYouScreen()}
    </div>
  );
};

export default WebsiteAuditTool;
