# 📧 Getting Contact Form Messages to Your Email

## How It Works with Netlify:

### Step 1: Deploy to Netlify
When you deploy your portfolio to Netlify, the contact form automatically becomes active.

### Step 2: Form Notifications Setup
1. **Go to your Netlify dashboard**
2. **Click on your site**
3. **Go to "Forms" tab**
4. **Click "Settings & usage"**
5. **Add email notification**:
   - Email: `bnithyashree16@gmail.com`
   - Subject: "New Portfolio Contact Form Submission"

### Step 3: What Happens When Someone Submits:

1. **Visitor fills out form** on your portfolio
2. **Netlify receives the submission**
3. **You get an email** with:
   - Sender's name
   - Sender's email
   - Subject
   - Message content
   - Timestamp
4. **You can reply directly** from your email

### Example Email You'll Receive:
```
From: notifications@netlify.com
To: bnithyashree16@gmail.com
Subject: New Portfolio Contact Form Submission

Name: John Recruiter
Email: john@company.com
Subject: Job Opportunity
Message: Hi Nithyashree, I saw your portfolio and would like to discuss a Data Engineering position...

Submitted at: Oct 31, 2025 2:30 PM
```

## 🔧 Alternative: Instant Email Setup

If you want emails immediately without Netlify dashboard setup:

### Option 1: Formspree (5 minutes setup)
1. Go to [formspree.io](https://formspree.io)
2. Sign up with `bnithyashree16@gmail.com`
3. Create a form
4. Get your form endpoint
5. Update your HTML form action

### Option 2: EmailJS (More advanced)
Direct email sending from the website without server.

## 🎯 Recommended: Stick with Netlify Forms
- **Free** (up to 100 submissions/month)
- **Spam protection** built-in
- **No external service** needed
- **Professional** and reliable
- **Dashboard** to view all submissions