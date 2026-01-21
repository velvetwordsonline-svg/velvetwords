# 🔄 ADMIN FLOW - Complete Navigation & Redirection

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN FLOW DIAGRAM                          │
└─────────────────────────────────────────────────────────────────┘

START: User visits http://localhost:3001
    ↓
┌─────────────────────┐
│   Root Page (/)     │
│  Check Auth Status  │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
Logged In?    Not Logged In?
    │             │
    │             ▼
    │      ┌─────────────────┐
    │      │  /login         │
    │      │  Login Page     │
    │      └────────┬────────┘
    │               │
    │               │ Enter credentials
    │               │ (admin/admin123)
    │               ▼
    │      ┌─────────────────┐
    │      │  POST /api/     │
    │      │  admin/login    │
    │      └────────┬────────┘
    │               │
    │        ┌──────┴──────┐
    │        │             │
    │        ▼             ▼
    │    Success       Failed
    │        │             │
    │        │             ▼
    │        │      Show error toast
    │        │      Stay on /login
    │        │
    │        ▼
    │   Store JWT token
    │   Store user data
    │        │
    └────────┴──────────┐
                        │
                        ▼
              ┌─────────────────┐
              │  /dashboard     │
              │  Dashboard Page │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌────────┐   ┌─────────┐   ┌─────────┐
    │Upload  │   │ Manage  │   │ Logout  │
    │Story   │   │Stories  │   │         │
    └───┬────┘   └────┬────┘   └────┬────┘
        │             │              │
        ▼             ▼              ▼
   /upload       /stories      Clear token
        │             │         Redirect /login
        │             │
        │             ▼
        │      ┌─────────────────┐
        │      │  View Stories   │
        │      │  Delete Stories │
        │      └─────────────────┘
        │
        ▼
┌─────────────────┐
│  Upload Form    │
│  - Title        │
│  - Author       │
│  - Description  │
│  - Category     │
│  - Thumbnail    │
│  - DOCX File    │
└────────┬────────┘
         │
         │ Submit
         ▼
┌─────────────────┐
│  POST /api/     │
│  admin/upload-  │
│  story          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend        │
│  Processing:    │
│  - Parse DOCX   │
│  - Extract      │
│  - Translate    │
│  - Save DB      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Success Toast  │
│  Redirect to    │
│  /stories       │
└─────────────────┘
```

---

## Route Protection Logic

### 1. Root Page (`/`)
```javascript
// Checks if user is logged in
if (user) {
  → Redirect to /dashboard
} else {
  → Redirect to /login
}
```

### 2. Login Page (`/login`)
```javascript
// If already logged in
if (user) {
  → Redirect to /dashboard
}

// On successful login
→ Store JWT token
→ Store user data
→ Redirect to /dashboard
```

### 3. Protected Pages (`/dashboard`, `/upload`, `/stories`)
```javascript
// Check authentication
if (!user) {
  → Redirect to /login
}

// If authenticated
→ Show page content
```

---

## Navigation Flow

### Initial Visit
```
User → http://localhost:3001
  ↓
Check localStorage for token
  ↓
No token found
  ↓
Redirect to /login
```

### Login Flow
```
User → /login
  ↓
Enter credentials
  ↓
Submit form
  ↓
POST /api/admin/login
  ↓
Backend validates
  ↓
Returns JWT token + user data
  ↓
Store in localStorage
  ↓
Update AuthContext state
  ↓
Redirect to /dashboard
```

### Dashboard Navigation
```
User on /dashboard
  ↓
Click "Upload Story"
  ↓
Navigate to /upload
  ↓
Fill form + upload files
  ↓
Submit
  ↓
Backend processes
  ↓
Success
  ↓
Redirect to /stories
```

### Logout Flow
```
User clicks "Logout"
  ↓
Clear localStorage
  ↓
Clear AuthContext state
  ↓
Redirect to /login
```

---

## URL Structure

```
┌─────────────────┬──────────────┬─────────────────────┐
│      URL        │  Protected?  │     Purpose         │
├─────────────────┼──────────────┼─────────────────────┤
│ /               │     No       │ Root redirect       │
│ /login          │     No       │ Admin login         │
│ /dashboard      │     Yes      │ Main dashboard      │
│ /upload         │     Yes      │ Upload story        │
│ /stories        │     Yes      │ Manage stories      │
└─────────────────┴──────────────┴─────────────────────┘
```

---

## Authentication States

### State 1: Not Authenticated
```
localStorage: empty
AuthContext.user: null

Allowed pages:
✅ /login

Blocked pages:
❌ /dashboard → Redirect to /login
❌ /upload → Redirect to /login
❌ /stories → Redirect to /login
```

### State 2: Authenticated
```
localStorage: 
  - adminToken: "eyJhbGc..."
  - adminUser: {"id":"...","username":"admin"}

AuthContext.user: {id, username, role}

Allowed pages:
✅ /dashboard
✅ /upload
✅ /stories

Auto-redirect:
/login → /dashboard
/ → /dashboard
```

---

## Complete User Journey

### First Time User
```
1. Visit http://localhost:3001
   → Redirects to /login

2. See login form
   → Enter admin/admin123

3. Click "Login"
   → POST to backend
   → Receive JWT token
   → Store in localStorage
   → Redirect to /dashboard

4. See dashboard
   → View statistics
   → See navigation menu

5. Click "Upload Story"
   → Navigate to /upload

6. Fill form and upload files
   → Submit
   → Backend processes
   → Success toast
   → Redirect to /stories

7. See uploaded story
   → Can delete if needed

8. Click "Logout"
   → Clear session
   → Redirect to /login
```

### Returning User
```
1. Visit http://localhost:3001
   → Check localStorage
   → Token found
   → Redirect to /dashboard

2. Already logged in
   → Can navigate freely
   → All protected pages accessible
```

---

## Error Handling

### Invalid Credentials
```
User enters wrong password
  ↓
Backend returns 401
  ↓
Show error toast
  ↓
Stay on /login
  ↓
User can retry
```

### Session Expired
```
User tries to access protected page
  ↓
Token expired or invalid
  ↓
Backend returns 401
  ↓
Clear localStorage
  ↓
Redirect to /login
  ↓
Show "Session expired" message
```

### Network Error
```
API call fails
  ↓
Show error toast
  ↓
User can retry
  ↓
Stay on current page
```

---

## Navigation Menu (When Logged In)

```
┌─────────────────────────────────────────────────────┐
│  Velvet Words Admin  │  Dashboard  Upload  Stories  │
│                                          admin  Logout│
└─────────────────────────────────────────────────────┘

Clicking:
- "Dashboard" → /dashboard
- "Upload Story" → /upload
- "Manage Stories" → /stories
- "Logout" → Clear session → /login
```

---

## Quick Reference

### Login
```
URL: http://localhost:3001/login
Credentials: admin / admin123
On Success: → /dashboard
```

### Dashboard
```
URL: http://localhost:3001/dashboard
Shows: Statistics, Quick actions
Protected: Yes
```

### Upload
```
URL: http://localhost:3001/upload
Shows: Upload form
On Success: → /stories
Protected: Yes
```

### Stories
```
URL: http://localhost:3001/stories
Shows: List of stories
Actions: View, Delete
Protected: Yes
```

---

## Testing the Flow

### Test 1: Initial Visit
```bash
1. Clear browser localStorage
2. Visit http://localhost:3001
3. Should redirect to /login
✅ Pass if redirected
```

### Test 2: Login
```bash
1. On /login page
2. Enter admin/admin123
3. Click Login
4. Should redirect to /dashboard
✅ Pass if redirected and token stored
```

### Test 3: Protected Routes
```bash
1. Logout
2. Try to visit /dashboard directly
3. Should redirect to /login
✅ Pass if redirected
```

### Test 4: Navigation
```bash
1. Login
2. Click "Upload Story"
3. Should navigate to /upload
4. Click "Dashboard"
5. Should navigate to /dashboard
✅ Pass if all navigation works
```

### Test 5: Logout
```bash
1. Login
2. Click "Logout"
3. Should redirect to /login
4. localStorage should be cleared
✅ Pass if logged out properly
```

---

**Flow is now complete with proper redirections! 🎉**
