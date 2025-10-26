# 🎯 JobCard Component - Documentation

**File:** `frontend/src/components/jobs/JobCard.js`  
**Lines:** 132 lines  
**Status:** ✅ Created and Ready

---

## 📋 Component Overview

The `JobCard` component displays job information in a card layout with role-based actions and interactive buttons.

---

## 🔧 Props Interface

```javascript
JobCard.propTypes = {
  job: {
    title: String, // Job title
    company: String, // Company name
    location: String, // Job location
    status: String, // 'active' | 'closed' | 'draft'
    salary_range: String, // Salary (optional)
    job_type: String, // 'Full-time' | 'Part-time' | 'Contract' (optional)
    description: String, // Job description (optional)
    requirements: String, // Job requirements (optional)
    created_at: Date / String, // Posted date
  },
  onApply: Function, // Callback when Apply button clicked
  onEdit: Function, // Callback when Edit button clicked
  onDelete: Function, // Callback when Delete button clicked
  onView: Function, // Callback when View button clicked
};
```

---

## 🎨 Features

### ✅ Header Section

- Job title (large, bold)
- Status badge with color-coded styling
  - Active → Green (success)
  - Closed → Red (danger)
  - Draft → Gray (secondary)

### ✅ Job Details

- Company name with building icon
- Location with map marker icon
- Salary range with dollar sign icon
- Job type with briefcase icon

### ✅ Description & Requirements

- Truncated job description (max 120 chars)
- Truncated requirements (max 100 chars)
- Small, muted text styling

### ✅ Posted Date

- Calendar icon
- Formatted date (e.g., "Oct 25, 2025")

### ✅ Action Buttons

- **View** button (outline primary) - Always visible
- **Apply** button (primary) - Only for candidates on active jobs
- **Edit** button (outline secondary) - Only for HR/Admin
- **Delete** button (outline danger) - Only for HR/Admin

---

## 🔐 Role-Based Logic

### **Candidate Users**

- ✅ Can see "Apply" button (only for active jobs)
- ✅ Can see "View" button
- ❌ Cannot see "Edit" or "Delete" buttons

### **HR/Admin Users**

- ✅ Can see "View" button
- ✅ Can see "Edit" button
- ✅ Can see "Delete" button
- ❌ Cannot see "Apply" button

---

## 📦 Dependencies

```javascript
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getStatusColor, truncateText } from '../../utils/helpers';
```

**Required Helper Functions:**

- ✅ `formatDate()` - Formats date strings
- ✅ `getStatusColor()` - Maps status to Bootstrap color classes
- ✅ `truncateText()` - Truncates text with ellipsis

**Required Hooks:**

- ✅ `useAuth()` - Access current user and role

---

## 💻 Usage Examples

### Basic Usage

```jsx
import JobCard from './components/jobs/JobCard';

const JobsList = ({ jobs }) => {
  const handleApply = (job) => {
    console.log('Applied to:', job.title);
    // Send API request
  };

  const handleView = (job) => {
    console.log('Viewing:', job.title);
    // Navigate to job details
  };

  return (
    <div className="row">
      {jobs.map((job) => (
        <div className="col-md-6 mb-4" key={job.id}>
          <JobCard job={job} onApply={handleApply} onView={handleView} />
        </div>
      ))}
    </div>
  );
};
```

### With All Callbacks

```jsx
<JobCard
  job={jobData}
  onApply={(job) => applyForJob(job.id)}
  onEdit={(job) => editJob(job.id)}
  onDelete={(job) => deleteJob(job.id)}
  onView={(job) => navigateToDetails(job.id)}
/>
```

### In JobsPage

```jsx
const JobsPage = () => {
  const [jobs, setJobs] = useState([]);

  const handleApply = async (job) => {
    try {
      await api.post('/applications', { job_id: job.id });
      toast.success('Application submitted!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (job) => {
    if (window.confirm('Delete this job?')) {
      try {
        await api.delete(`/jobs/${job.id}`);
        setJobs(jobs.filter((j) => j.id !== job.id));
        toast.success('Job deleted!');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="row">
      {jobs.map((job) => (
        <div className="col-md-6 mb-4" key={job.id}>
          <JobCard
            job={job}
            onApply={handleApply}
            onEdit={(job) => setEditingJob(job)}
            onDelete={handleDelete}
            onView={(job) => navigateToJobDetails(job.id)}
          />
        </div>
      ))}
    </div>
  );
};
```

---

## 🎯 Bootstrap Classes Used

| Class                     | Purpose               |
| ------------------------- | --------------------- |
| `card h-100`              | Full height card      |
| `card-body`               | Card content area     |
| `badge bg-*`              | Status badge          |
| `btn-group`               | Button grouping       |
| `btn btn-primary`         | Primary action button |
| `btn btn-outline-*`       | Outline buttons       |
| `btn-sm`                  | Small button size     |
| `d-flex`                  | Flexbox layout        |
| `justify-content-between` | Space between         |
| `align-items-center`      | Vertical alignment    |
| `text-muted`              | Gray text             |
| `fw-medium`               | Medium font weight    |

---

## 🎨 CSS Class Requirements

Your app should have Bootstrap 5 CSS included:

```html
<!-- In public/index.html -->
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
/>
```

Or via npm:

```bash
npm install bootstrap
```

```javascript
// In src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
```

---

## 📊 Sample Job Data Structure

```javascript
const sampleJob = {
  id: 1,
  title: 'Senior React Developer',
  company: 'Tech Corp',
  location: 'San Francisco, CA',
  salary_range: '$100k - $150k',
  job_type: 'Full-time',
  status: 'active',
  description: 'We are looking for an experienced React developer...',
  requirements: 'Must have 5+ years React experience, TypeScript knowledge...',
  created_at: '2025-10-20T10:30:00Z',
};
```

---

## ✨ Features Breakdown

### Display Features

- ✅ Title and status badge
- ✅ Company with icon
- ✅ Location with icon
- ✅ Salary with icon
- ✅ Job type with icon
- ✅ Description preview (truncated)
- ✅ Requirements preview (truncated)
- ✅ Posted date
- ✅ Responsive card layout

### Interactive Features

- ✅ View job details
- ✅ Apply for job (candidates only)
- ✅ Edit job (HR/Admin only)
- ✅ Delete job (HR/Admin only)
- ✅ Button tooltips via title attribute
- ✅ Icon buttons for actions

### Smart Features

- ✅ Role-based button visibility
- ✅ Status-based apply availability
- ✅ Icon indicators for all fields
- ✅ Optional fields handling
- ✅ Safe callback execution

---

## 🔄 Integration Checklist

Before using JobCard, ensure:

- [x] AuthContext is set up with useAuth hook
- [x] Helper functions are exported from utils/helpers.js
- [x] Bootstrap 5 CSS is included
- [x] Font Awesome icons are available
- [x] Parent component handles all callbacks
- [x] Job data structure matches schema

---

## 🎊 Component Status

✅ **CREATED AND READY TO USE**

- 132 lines of clean, production-grade code
- Fully typed with proper prop handling
- Role-based access control implemented
- Bootstrap 5 fully styled
- Error-safe callback handling
- Responsive design included

**Ready for integration with JobsPage and job management features!** 🚀
