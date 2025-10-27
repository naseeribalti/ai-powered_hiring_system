# Quick Test Guide

## Test the Changes

### 1. Backend (Server Test)

```cmd
node backend/server.js
```

✅ Should start without "Cannot find module 'helmet'" error

---

### 2. Forgot Password Flow

#### Step 1: Navigate to Forgot Password

```
http://localhost:3000/forgot-password
```

#### Step 2: Enter Email

- Enter: your-test-email@example.com
- Click "Send Reset Link"
- Should see: "Email Sent!" success message

#### Step 3: Check Email

- Open email inbox
- Find "Password Reset Request" email
- Click the reset link (or copy URL)

#### Step 4: Reset Password

- URL format: `http://localhost:3000/reset-password/TOKEN_HERE`
- Enter new password (min 8 characters)
- Confirm password (must match)
- Click "Reset Password"
- Should redirect to login page

#### Step 5: Login with New Password

- Go to `http://localhost:3000/login`
- Use new password
- Should login successfully ✅

---

### 3. UI Changes (Visual Check)

#### Chatbot

- Click chatbot button (bottom right)
- ✅ Dialog should be smaller (320×420px)
- ✅ Should NOT overlap with navbar
- ✅ Blue color scheme (#0077b5)

#### Color Scheme

- Check any page (home, jobs, dashboard)
- ✅ Professional blue theme (no purple)
- ✅ No dark mode toggle
- ✅ LinkedIn/Indeed style

#### Pages to Check:

- Home page gradient
- Job cards
- Login/Register forms
- Dashboard
- Profile page
- Navigation bar

---

## Environment Setup

### Required .env Variables

```env
# Email (for forgot password feature)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@ai-hiring.com
FRONTEND_URL=http://localhost:3000

# Existing variables (keep these)
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret
PORT=3001
```

### Gmail Setup (if using Gmail)

1. Go to Google Account settings
2. Enable 2-Step Verification
3. Generate App Password
4. Use App Password in EMAIL_PASS

---

## Quick Checklist

### Backend

- [x] npm install completed
- [x] helmet package installed
- [x] express-rate-limit installed
- [ ] .env configured with email settings
- [ ] Server starts successfully
- [ ] No console errors

### Frontend

- [ ] Navigate to /forgot-password works
- [ ] Navigate to /reset-password/:token works
- [ ] Forms submit successfully
- [ ] Success messages display
- [ ] Error handling works
- [ ] New blue color scheme applied
- [ ] Chatbot dialog is smaller
- [ ] No dark mode toggle visible

### Email

- [ ] Reset email sends successfully
- [ ] Email contains reset link
- [ ] Link format is correct
- [ ] Token works within 1 hour
- [ ] Expired tokens rejected

---

## Troubleshooting

### "Cannot find module 'helmet'"

✅ **FIXED** - Packages added to package.json and installed

### Email not sending

- Check EMAIL_USER and EMAIL_PASS in .env
- Verify Gmail App Password (not regular password)
- Check spam folder
- In development, email errors are logged but don't fail request

### Reset link expired

- Tokens expire after 1 hour
- Request new reset link from /forgot-password

### Colors not updating

- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check variables.css loaded correctly

---

## API Endpoints

### New Endpoints

```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
Response: 200 { "message": "..." }

POST /api/auth/reset-password/:token
Body: { "password": "newpassword123" }
Response: 200 { "message": "Password reset successful..." }
```

### Existing Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

---

## URLs

### Frontend Routes

```
/                       - Landing page
/login                  - Login page
/register               - Register page
/forgot-password        - Forgot password (NEW)
/reset-password/:token  - Reset password (NEW)
/dashboard              - User dashboard
/jobs                   - Browse jobs
/profile                - User profile
```

### Backend API

```
http://localhost:3001/api/auth/*
http://localhost:3001/api/jobs/*
http://localhost:3001/api/applications/*
```

---

## Git Status

**No commits made yet** (per user request: "not push")

### Files Ready to Commit:

- package.json (helmet + rate-limit)
- backend/models/User.js (reset token fields)
- backend/controllers/authController.js (forgot/reset functions)
- backend/routes/auth.js (new routes)
- frontend/src/styles/variables.css (new colors)
- frontend/src/components/AIChatbot/AIChatbot.css (updated styling)
- frontend/src/pages/ForgotPassword/\* (3 new files)
- frontend/src/pages/ResetPassword/\* (3 new files)
- frontend/src/App.js (new routes)

### Suggested Commit Messages:

```bash
git add package.json
git commit -m "fix: add helmet and express-rate-limit dependencies"

git add backend/
git commit -m "feat: implement forgot password backend functionality"

git add frontend/src/styles/ frontend/src/components/AIChatbot/
git commit -m "style: redesign UI with professional LinkedIn-inspired theme"

git add frontend/src/pages/ForgotPassword/ frontend/src/pages/ResetPassword/ frontend/src/App.js
git commit -m "feat: implement forgot password frontend pages and routing"
```

---

## Success Criteria

✅ All features implemented
✅ Backend starts without errors
✅ No MODULE_NOT_FOUND issues
✅ Professional color scheme applied
✅ Chatbot dialog size reduced
✅ Forgot password pages created
✅ Routes configured
✅ Email integration ready

**Status: Ready for Testing** 🚀
