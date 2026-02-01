# Smart Campus ERP - Quick Start Guide

## 🚀 Getting Started (30 seconds)

### Option 1: Simple HTTP Server
```bash
# If you have Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Or Node.js
npx http-server

# Or PHP
php -S localhost:8000
```

Then open: `http://localhost:8000/login.html`

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click on login.html → "Open with Live Server"
3. Automatically opens in browser

### Option 3: Direct File
- Simply double-click `login.html` in file explorer
- Works in Chrome/Firefox/Safari (not IE)

## 🔑 Demo Credentials

| User Type | Username  | Password  |
|-----------|-----------|-----------|
| Admin     | `admin`   | `admin123` |
| Faculty   | `faculty1` | `faculty123` |
| Student   | `student1` | `student123` |

## 🎯 What to Try First

### As Admin
1. Login with `admin` / `admin123`
2. See Admin Dashboard with KPIs
3. Navigate to Students → Add a student
4. Navigate to Faculty → Add faculty member
5. Navigate to Courses → Add a course
6. Go to Dashboard → See updated counts

### As Faculty
1. Login with `faculty1` / `faculty123`
2. See Faculty Dashboard (different from admin)
3. Go to Attendance → Mark attendance
4. Students menu hidden (admin only)
5. See your classes in dashboard

### As Student
1. Login with `student1` / `student123`
2. See Student Dashboard
3. Most admin menus hidden
4. Can see:
   - Courses
   - Timetable
   - Library
   - Placements
   - Materials

## ⚙️ How It Works

### Authentication Flow
```
1. Click "Sign in" on login.html
2. JavaScript checks demo credentials in auth.js
3. Session saved to browser localStorage
4. Redirected to dashboard
5. Click "Logout" to clear session
```

### Data Storage
- All data stored in browser's localStorage
- No backend server needed
- Data persists while browser closed
- Clear localStorage to reset all data (DevTools → Application → Local Storage)

### Navigation
- Click any sidebar item to navigate
- No page reload needed (but does reload for simplicity)
- All pages check if user logged in via `requireAuth()`

## 🛠️ Common Tasks

### Add a Student
1. Go to Students page
2. Click "Add Student" button
3. Fill in form
4. Click "Save"
5. Student appears in table

### Mark Attendance
1. Go to Attendance page
2. Select date, class, student ID
3. Choose Present/Absent
4. Click "Save"
5. View "Recent Attendance" table below

### View Student Attendance Summary
1. Go to Attendance page
2. Scroll to "Student-wise Summary"
3. Enter Student ID (e.g., S001)
4. Click "Calculate"
5. See attendance percentage

### Enter Exam Marks
1. Go to Exams & Results page
2. Fill in Student ID, Course Code, Type, Marks
3. Click "Save Marks"
4. View in "Marks Ledger" below

### View Student Grades
1. Go to Exams & Results page
2. Scroll to "Result Lookup"
3. Enter Student ID
4. Click "View Result"
5. See grades and average

## 🎨 Customization

### Change Colors
Edit `css/main.css`:
```css
:root {
  --primary-color: #2563eb;      /* Change blue to your color */
  --secondary-color: #6366f1;
  --success-color: #16a34a;
  --danger-color: #dc2626;
  /* ... other colors ... */
}
```

### Change App Name
Edit each HTML file:
```html
<span class="brand-title">Your Campus Name</span>
<span class="brand-subtitle">Your System Name</span>
```

### Modify Demo Credentials
Edit `js/auth.js`:
```javascript
const DEMO_USERS = {
  'yourname': { password: 'yourpass', role: 'admin', name: 'Your Name' },
  // Add more users
};
```

## 🔍 Debugging

### Open Developer Tools
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (Mac)

### Check JavaScript Errors
1. Console tab → see any red errors
2. Network tab → verify JS files loaded (200 status)

### Check Stored Data
1. Application tab → Local Storage
2. Click domain name to expand
3. See all stored data (students, faculty, etc.)

### Clear Data
1. Application tab → Local Storage
2. Right-click domain → Delete

## ❓ Troubleshooting

### "Cannot find module" error
**Problem**: JavaScript modules not loading
**Solution**: Ensure all files in `/js` folder exist

### Pages not loading
**Problem**: Stuck on loading screen
**Solution**: 
1. Press F12 → Console
2. Look for error messages
3. Ensure HTTP server running (not opening local file)

### Login not working
**Problem**: "Invalid credentials" when entering correct username
**Solution**: Username/password are case-sensitive. Check spelling exactly as shown in credentials table

### Data not saving
**Problem**: Changes disappear after refresh
**Solution**: 
1. localStorage might be disabled
2. Try different browser
3. Clear browser cache and try again

### Sidebar menu items not hiding
**Problem**: Students see admin items
**Solution**: 
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear cache
3. Check browser console for JS errors

## 📱 Mobile Support

The app is responsive and works on mobile:
- Tap "☰" menu if available (not implemented but CSS ready)
- Tables scroll horizontally
- Forms stack vertically
- Touches work same as clicks

## 🔗 Next Steps

### To Add More Features
1. Create new page HTML file (e.g., `reports.html`)
2. Create corresponding JS module (e.g., `js/reports.js`)
3. Add navigation item to sidebar
4. Create UI and logic in JS

### To Connect Real Backend
1. Update API calls in `js/api.js`
2. Replace localStorage with fetch/axios calls
3. No other code changes needed!

### To Deploy to Server
1. Copy all files to web server
2. Ensure all paths are correct
3. All data now persists server-side if using real backend

---

## 📞 Quick Reference

| Action | Where |
|--------|-------|
| View all students | Students page |
| Add student | Students page → Add Student button |
| Mark attendance | Attendance page → Mark Attendance form |
| Enter marks | Exams & Results → Marks Entry form |
| View grades | Exams & Results → Result Lookup |
| Manage fees | Fees page |
| Set timetable | Timetable page |
| Send announcements | Notifications page |
| Manage library | Library page |
| Track placements | Placements page |
| Change settings | Settings page |

---

**You're all set! 🎉 Start exploring the application.** 

If you run into any issues, check the Troubleshooting section or look at browser console (F12).
