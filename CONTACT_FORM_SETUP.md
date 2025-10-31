# 📧 Contact Form Setup Guide

Your portfolio currently has a contact form, but you need to set it up to receive emails. Here are the best options:

## 🚀 Option 1: Formspree (Recommended - FREE)

**Formspree** is perfect for static sites like yours. It's free for up to 50 submissions per month.

### Setup Steps:

1. **Go to [formspree.io](https://formspree.io)**
2. **Sign up** with your email (bnithyashree16@gmail.com)
3. **Create a new form**
4. **Copy your form endpoint** (looks like: `https://formspree.io/f/xyzabc123`)
5. **Replace in your HTML**: 
   - Open `index.html`
   - Find: `action="https://formspree.io/f/YOUR_FORM_ID"`
   - Replace `YOUR_FORM_ID` with your actual form ID

### ✅ Benefits:
- ✅ **Free** (up to 50 submissions/month)
- ✅ **No backend required**
- ✅ **Spam protection**
- ✅ **Email notifications** sent directly to you
- ✅ **Works with GitHub Pages**

## 🛠️ Option 2: Netlify Forms (Alternative)

If you deploy to Netlify instead of GitHub Pages:

1. Deploy to Netlify
2. Add `netlify` attribute to your form
3. Netlify handles the rest automatically

## 📧 Option 3: EmailJS (Client-side)

For a more advanced solution:

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Configure email service
3. Add EmailJS to your JavaScript

## 🔧 Current Form Status

Your form is already set up for Formspree - you just need to:

1. **Sign up at formspree.io**
2. **Get your form ID**
3. **Replace `YOUR_FORM_ID` in index.html**

That's it! Messages will then come directly to bnithyashree16@gmail.com

## 📋 What Happens When Someone Submits:

1. **User fills form** on your portfolio
2. **Formspree processes** the submission
3. **You get an email** with:
   - Sender's name
   - Sender's email
   - Subject
   - Message content
4. **You can reply directly** from your email

Perfect for networking and job opportunities! 🚀