# Smart Campus ERP - Complete File Index

## 📋 Documentation Files

### QUICKSTART.md
**What**: 30-second setup guide
**Contains**: 
- How to start the app
- Demo credentials
- First things to try
- Common tasks
- Troubleshooting tips
**Read this**: First time setup

### README.md
**What**: Complete project overview
**Contains**:
- Issues fixed explanation
- Project structure
- Features list
- Module dependencies
- Authentication flow
- Future enhancements
**Read this**: Understanding the architecture

### FIXES_SUMMARY.md
**What**: Detailed technical breakdown
**Contains**:
- All 3 problems explained
- Root causes
- Exact solutions with code
- Files created summary
- Data flow diagrams
**Read this**: Understanding what was fixed

### INDEX.md (this file)
**What**: Directory of all files
**Contains**: Description of every file and folder
**Read this**: Finding specific files

---

## 📄 HTML Pages (15 files)

### Login & Main
| File | Purpose | Access |
|------|---------|--------|
| **login.html** | Authentication page | Public (no login needed) |
| **index.html** | Redirect page | Redirects to login.html |

### Dashboard & Main Views
| File | Purpose | Access | Role |
|------|---------|--------|------|
| **dashboard.html** | Main dashboard | All logged in | All |
| **students.html** | Student management | Protected | Admin |
| **faculty.html** | Faculty management | Protected | Admin |

### Academic Management
| File | Purpose | Access | Role |
|------|---------|--------|------|
| **courses.html** | Course CRUD | Protected | Admin/Faculty |
| **attendance.html** | Attendance tracking | Protected | Admin/Faculty |
| **exams.html** | Marks & results | Protected | All |
| **timetable.html** | Class schedule | Protected | Admin/Faculty |

### Financial & Admin
| File | Purpose | Access | Role |
|------|---------|--------|------|
| **fees.html** | Fee management | Protected | Admin |

### Student Services
| File | Purpose | Access | Role |
|------|---------|--------|------|
| **library.html** | Library management | Protected | All |
| **placements.html** | Placement tracking | Protected | All |

### Communication & Resources
| File | Purpose | Access | Role |
|------|---------|--------|------|
| **notifications.html** | Announcements/messages | Protected | All |
| **materials.html** | Study materials | Protected | All |

### User Settings
| File | Purpose | Access | Role |
|------|---------|--------|------|
| **settings.html** | User preferences | Protected | All |

---

## 📦 JavaScript Modules (16 files in `/js` folder)

### Core Modules (4 files)
**These are used by all pages**

| File | Lines | Purpose | Exports |
|------|-------|---------|---------|
| **auth.js** | 107 | Authentication & sessions | `login()`, `getSession()`, `requireAuth()`, `logout()`, `isAdmin()`, `isFaculty()`, `isStudent()` |
| **api.js** | 167 | Mock API with localStorage | `fetchAPI(endpoint, method, body)` |
| **utils.js** | 66 | UI utilities | `createEl()`, `showToast()`, `setupLogout()`, `setCurrentUser()`, `debounce()`, `formatDate()` |
| **app.js** | 47 | App shell initialization | `initShell(currentPage)` |

### Page Modules (12 files)
**One module per page - loads data and handles interactions**

| File | Purpose | Endpoints Used |
|------|---------|-----------------|
| **dashboard.js** | Load KPIs & today's data | `/api/students`, `/api/faculty`, `/api/attendance`, `/api/notifications` |
| **students.js** | CRUD students | `/api/students` |
| **faculty.js** | CRUD faculty | `/api/faculty` |
| **courses.js** | CRUD courses | `/api/courses` |
| **attendance.js** | Mark & view attendance | `/api/attendance` |
| **exams.js** | Enter marks, view grades | localStorage for marks storage |
| **fees.js** | Manage fees & payments | localStorage for fee structures |
| **timetable.js** | Create class schedule | localStorage for timetable |
| **notifications.js** | Send & view announcements | `/api/notifications` |
| **library.js** | Manage books & issues | localStorage for books & issues |
| **placements.js** | Track company drives & placements | localStorage for companies & placements |
| **materials.js** | Display shared materials | Hardcoded sample data |
| **settings.js** | User preferences | localStorage for settings |

### Module Dependencies Graph
```
Every page module imports:
├── auth.js (authentication)
├── app.js (UI initialization)
│   └── requires auth.js
├── api.js (data fetching)
├── utils.js (UI helpers)

Every page module pattern:
1. Import dependencies
2. Call requireAuth() - redirects if not logged in
3. Call initShell(pageName) - setup sidebar
4. Call load functions - fetch & display data
5. Attach event listeners - handle user input
```

---

## 🎨 CSS Files (6 files in `/css` folder)

| File | Lines | Purpose | Includes |
|------|-------|---------|----------|
| **main.css** | 150 | Colors, fonts, variables, utilities | CSS variables, base styles, toast notifications |
| **layout.css** | 130 | Sidebar, topbar, main layout | App shell layout, responsive grid |
| **components.css** | 180 | Cards, buttons, modals, grids | `.card`, `.btn`, `.btn-primary`, `.modal`, `.grid-2` |
| **forms.css** | 170 | Form inputs and auth screen | Form layouts, input styling, login page |
| **tables.css** | 100 | Table styling | `.table`, responsive tables |
| **dashboard.css** | 100 | Dashboard-specific styling | KPI cards, charts, stats |

### CSS Cascade
```
HTML page loads all CSS files
main.css       → Colors, variables, base styles
layout.css     → Page structure (sidebar, main, topbar)
components.css → Reusable components (cards, buttons)
forms.css      → Form-specific styles
tables.css     → Table-specific styles
dashboard.css  → Dashboard overrides
```

---

## 🗂️ Directory Structure

```
smart-campus/
│
├── 📄 HTML Pages (15 files)
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── students.html
│   ├── faculty.html
│   ├── courses.html
│   ├── attendance.html
│   ├── exams.html
│   ├── fees.html
│   ├── timetable.html
│   ├── notifications.html
│   ├── library.html
│   ├── placements.html
│   ├── materials.html
│   └── settings.html
│
├── 📁 css/ (6 files - Styling)
│   ├── main.css          (Colors, variables, utilities)
│   ├── layout.css        (Sidebar & layout)
│   ├── components.css    (Cards, buttons, modals)
│   ├── forms.css         (Forms & auth)
│   ├── tables.css        (Tables)
│   └── dashboard.css     (Dashboard specific)
│
├── 📁 js/ (16 files - JavaScript Logic)
│   ├── Core Modules (used by all pages)
│   │   ├── auth.js       (Authentication)
│   │   ├── api.js        (Mock API)
│   │   ├── utils.js      (Utilities)
│   │   └── app.js        (App shell)
│   │
│   └── Page Modules (one per page)
│       ├── dashboard.js
│       ├── students.js
│       ├── faculty.js
│       ├── courses.js
│       ├── attendance.js
│       ├── exams.js
│       ├── fees.js
│       ├── timetable.js
│       ├── notifications.js
│       ├── library.js
│       ├── placements.js
│       ├── materials.js
│       └── settings.js
│
└── 📚 Documentation (4 files)
    ├── QUICKSTART.md     (30-second setup)
    ├── README.md         (Complete guide)
    ├── FIXES_SUMMARY.md  (Technical details)
    └── INDEX.md          (This file)
```

**Total Files**: 38 + documentation
**Total Code Lines**: ~4500+ lines
**Total Size**: ~300KB

---

## 🔄 Data Flow Map

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
        ┌────────────────┐
        │   login.html   │
        │   (public)     │
        └────────┬───────┘
                 │
    (auth.js validates username/password)
                 │
                 ↓
        ┌────────────────┐
        │  localStorage  │
        │  (session)     │
        └────────┬───────┘
                 │
                 ↓
        ┌────────────────────┐
        │ dashboard.html     │
        │ (requireAuth)      │
        └────────┬───────────┘
                 │
    (app.js initializes shell)
    (api.js fetches data)
                 │
        ┌────────▼─────────┐
        │ Other pages      │
        │ (all pages follow│
        │ same pattern)    │
        └──────────────────┘
```

---

## 📊 File Statistics

### By Type
- **HTML**: 15 files (structure)
- **CSS**: 6 files (styling)
- **JavaScript**: 16 files (logic)
- **Documentation**: 4 files (guides)

### By Size
- **Large**: auth.js (107 lines), api.js (167 lines), students.js (89 lines)
- **Medium**: Most page modules (60-90 lines)
- **Small**: materials.js (30 lines), settings.js (27 lines)

### By Purpose
- **Core Infrastructure**: 4 files (auth, api, utils, app)
- **Page-Specific Logic**: 12 files (one per page)
- **Styling**: 6 files
- **UI Structure**: 15 files

---

## 🔑 Key Concepts

### Module System
- Uses ES6 modules (`import`/`export`)
- Each page is independent
- Dependencies clearly declared
- Easy to add/remove features

### Authentication
- No backend - uses localStorage
- Demo accounts hardcoded
- Can be swapped for real backend
- Session persists across refreshes

### Data Storage
- No database - uses localStorage
- All data stored in browser
- Persists until cleared
- Can be replaced with real API

### Styling
- CSS variables for consistency
- Dark theme by default
- Responsive design
- Easy to customize

---

## 🚀 Quick Reference

### To Add a New Page
1. Create `newpage.html` (copy existing page as template)
2. Create `js/newpage.js` with proper imports
3. Add navigation item to sidebar in all HTML files
4. Done! (No other changes needed)

### To Change Colors
Edit `css/main.css` CSS variables section

### To Modify Authentication
Edit `js/auth.js` DEMO_USERS object

### To Add Real Backend
Edit `js/api.js` fetchAPI() function

### To Debug Issues
Press F12 → Console tab → Check for errors

---

## 📞 File Lookup Table

### "I need to change X, where do I go?"

| Task | File |
|------|------|
| Change colors/theme | `css/main.css` |
| Change app name | All `.html` files in sidebar |
| Change login credentials | `js/auth.js` |
| Add new menu item | All `.html` files + `js/app.js` |
| Change button styles | `css/components.css` |
| Change form styling | `css/forms.css` |
| Change table styling | `css/tables.css` |
| Fix page not loading | `js/[pagename].js` |
| Fix infinite buffering | Check browser console (F12) |
| Add new page | Create `.html` + create `js/[pagename].js` |
| Hide menu for role | `js/app.js` in initShell() |
| Change demo data | `js/api.js` initMockData() |
| Change notification | `js/notifications.js` |

---

**This index covers all 38 files in the project. Each file is essential for the application to function.**

Last updated: February 2026
