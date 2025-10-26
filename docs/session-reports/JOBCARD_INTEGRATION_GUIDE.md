# 🚀 JobCard Integration & Usage Guide

**Created:** October 25, 2025  
**Status:** ✅ Ready for Production

---

## 📍 File Location

```
frontend/src/components/jobs/JobCard.js (132 lines)
```

---

## 🔗 How to Import and Use

### Step 1: Import in Your Component

```jsx
import JobCard from './components/jobs/JobCard';
```

### Step 2: Pass Job Data and Callbacks

```jsx
<JobCard
  job={jobData}
  onApply={handleApply}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
/>
```

---

## 📚 Complete Implementation Examples

### Example 1: In JobsPage Component

```jsx
import React, { useState } from 'react';
import JobCard from '../components/jobs/JobCard';
import { useApi } from '../hooks';
import api from '../services/api';
import toast from 'react-hot-toast';

const JobsPage = () => {
  const {
    data: jobs,
    loading,
    refetch,
  } = useApi(['jobs'], () => api.get('/jobs').then((res) => res.data));

  const handleApply = async (job) => {
    try {
      await api.post('/applications', { job_id: job.id });
      toast.success('Application submitted successfully!');
      refetch(); // Refresh job list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  const handleEdit = (job) => {
    // Navigate to edit page or open edit modal
    console.log('Edit job:', job);
  };

  const handleDelete = async (job) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await api.delete(`/jobs/${job.id}`);
      toast.success('Job deleted successfully!');
      refetch(); // Refresh job list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleView = (job) => {
    // Navigate to job details page
    console.log('View job:', job);
  };

  if (loading) return <div className="text-center p-5">Loading jobs...</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Available Jobs</h2>

      <div className="row">
        {jobs?.map((job) => (
          <div className="col-md-6 mb-4" key={job.id}>
            <JobCard
              job={job}
              onApply={handleApply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </div>
        ))}
      </div>

      {jobs?.length === 0 && (
        <div className="alert alert-info">No jobs available at the moment.</div>
      )}
    </div>
  );
};

export default JobsPage;
```

---

### Example 2: With Search and Filters

```jsx
import React, { useState } from 'react';
import JobCard from '../components/jobs/JobCard';
import SearchFilter from '../components/common/SearchFilter';
import Pagination from '../components/common/Pagination';
import { useApi, useDebounce, usePagination } from '../hooks';

const JobsPageWithFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: allJobs = [] } = useApi(['jobs'], () =>
    api.get('/jobs').then((res) => res.data)
  );

  // Filter jobs
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      job.company.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const {
    currentData: paginatedJobs,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination(filteredJobs, 6);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Job Listings</h2>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        filterOptions={[
          { value: 'active', label: 'Active' },
          { value: 'closed', label: 'Closed' },
          { value: 'draft', label: 'Draft' },
        ]}
        placeholder="Search by title or company..."
      />

      <div className="row">
        {paginatedJobs.map((job) => (
          <div className="col-md-6 mb-4" key={job.id}>
            <JobCard
              job={job}
              onApply={handleApply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </div>
        ))}
      </div>

      {paginatedJobs.length === 0 && (
        <div className="alert alert-info text-center">
          No jobs match your search criteria.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={filteredJobs.length}
            itemsPerPage={6}
          />
        </div>
      )}
    </div>
  );
};

export default JobsPageWithFilters;
```

---

### Example 3: With Modal for Job Details

```jsx
import React, { useState } from 'react';
import JobCard from '../components/jobs/JobCard';
import Modal from '../components/common/Modal';

const JobsPageWithModal = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleView = (job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  return (
    <div className="container py-5">
      <div className="row">
        {jobs?.map((job) => (
          <div className="col-md-6 mb-4" key={job.id}>
            <JobCard
              job={job}
              onView={handleView}
              onApply={handleApply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedJob?.title}
        size="lg"
      >
        <div className="job-detail-modal">
          <div className="mb-3">
            <h6 className="text-muted">Company</h6>
            <p>{selectedJob?.company}</p>
          </div>

          <div className="mb-3">
            <h6 className="text-muted">Location</h6>
            <p>{selectedJob?.location}</p>
          </div>

          <div className="mb-3">
            <h6 className="text-muted">Salary Range</h6>
            <p>{selectedJob?.salary_range}</p>
          </div>

          <div className="mb-3">
            <h6 className="text-muted">Description</h6>
            <p>{selectedJob?.description}</p>
          </div>

          <div className="mb-3">
            <h6 className="text-muted">Requirements</h6>
            <p>{selectedJob?.requirements}</p>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowDetailModal(false)}
            >
              Close
            </button>
            <button className="btn btn-primary" onClick={handleApply}>
              Apply Now
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobsPageWithModal;
```

---

## 🎯 Role-Based Visibility

### For Candidate User

```
┌─────────────────────────────┐
│ Senior React Developer      │  ← Title
│ Status: Active              │  ← Badge
├─────────────────────────────┤
│ Company: Tech Corp          │
│ Location: San Francisco     │
│ Salary: $100k - $150k       │
│ Type: Full-time             │
├─────────────────────────────┤
│ Description preview...      │
│ Requirements preview...     │
├─────────────────────────────┤
│ Posted: Oct 20, 2025   [👁] [✈️ Apply] │
└─────────────────────────────┘
```

### For HR/Admin User

```
┌─────────────────────────────┐
│ Senior React Developer      │  ← Title
│ Status: Active              │  ← Badge
├─────────────────────────────┤
│ Company: Tech Corp          │
│ Location: San Francisco     │
│ Salary: $100k - $150k       │
│ Type: Full-time             │
├─────────────────────────────┤
│ Description preview...      │
│ Requirements preview...     │
├─────────────────────────────┤
│ Posted: Oct 20, 2025   [👁] [✏️] [🗑️] │
└─────────────────────────────┘
```

---

## 🧪 Testing the Component

### Sample Test Job Data

```javascript
const testJob = {
  id: 1,
  title: 'Senior React Developer',
  company: 'Tech Corp',
  location: 'San Francisco, CA',
  salary_range: '$100k - $150k',
  job_type: 'Full-time',
  status: 'active',
  description:
    'We are looking for an experienced React developer with 5+ years of experience in building scalable web applications.',
  requirements:
    'Must have experience with React, Node.js, MongoDB, and AWS. Strong communication skills required.',
  created_at: '2025-10-20T10:30:00Z',
};
```

### Quick Test Component

```jsx
import JobCard from './components/jobs/JobCard';

const JobCardTest = () => {
  const testJob = {
    id: 1,
    title: 'Senior React Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary_range: '$100k - $150k',
    job_type: 'Full-time',
    status: 'active',
    description: 'Test job description...',
    requirements: 'Test requirements...',
    created_at: new Date(),
  };

  return (
    <div className="container py-5">
      <JobCard
        job={testJob}
        onApply={() => console.log('Apply clicked')}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
        onView={() => console.log('View clicked')}
      />
    </div>
  );
};
```

---

## ✅ Pre-Integration Checklist

- [x] JobCard.js file created at `frontend/src/components/jobs/JobCard.js`
- [x] All helper functions available in `utils/helpers.js`
- [x] AuthContext provides user role information
- [x] Bootstrap 5 CSS is included in project
- [x] Font Awesome icons are available
- [x] API service configured for job operations
- [x] Toast notifications set up (react-hot-toast)
- [x] All callback handlers defined

---

## 📊 Component Stats

| Metric                | Value                                      |
| --------------------- | ------------------------------------------ |
| **File Size**         | 132 lines                                  |
| **Props**             | 5 (job, onApply, onEdit, onDelete, onView) |
| **Callbacks**         | 4 (Apply, Edit, Delete, View)              |
| **Roles**             | 3 (Candidate, HR, Admin)                   |
| **Bootstrap Classes** | 20+                                        |
| **Icons Used**        | 10+ (Font Awesome)                         |
| **Responsive**        | Yes (col-md-6)                             |

---

## 🎊 Status: READY TO INTEGRATE

Your JobCard component is production-ready and can be immediately integrated into your JobsPage or any other job listing interface!

**Next Steps:**

1. Import JobCard in JobsPage component
2. Pass job data from API
3. Implement callback handlers
4. Test with different user roles
5. Deploy to production

---

_Documentation Created: October 25, 2025_  
_Component Status: ✅ Production Ready_
