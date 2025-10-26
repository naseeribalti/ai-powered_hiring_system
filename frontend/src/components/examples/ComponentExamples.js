/**
 * Component Usage Examples
 * 
 * Quick reference guide for using the new UI components
 */

import React, { useState } from 'react';
import {
    Button,
    Card,
    Badge,
    Avatar,
    Modal,
    Dropdown,
    SearchBar,
    NotificationBell
} from './components/common';
import { FaUser, FaCog, FaSignOutAlt, FaBriefcase } from 'react-icons/fa';

// ========================================
// BUTTON EXAMPLES
// ========================================

function ButtonExamples() {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            {/* Basic Buttons */}
            <Button variant="primary">Apply Now</Button>
            <Button variant="secondary">Learn More</Button>
            <Button variant="success">Saved</Button>
            <Button variant="danger">Delete</Button>

            {/* Outline Buttons */}
            <Button variant="outline-primary">Browse Jobs</Button>

            {/* With Icons */}
            <Button variant="primary" icon={<FaBriefcase />}>
                View Job
            </Button>

            {/* Loading State */}
            <Button variant="primary" loading={loading} onClick={() => setLoading(true)}>
                Submit Application
            </Button>

            {/* Sizes */}
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>

            {/* Full Width */}
            <Button variant="primary" fullWidth>
                Full Width Button
            </Button>
        </div>
    );
}

// ========================================
// CARD EXAMPLES
// ========================================

function CardExamples() {
    return (
        <div>
            {/* Basic Card */}
            <Card>
                <h3>Job Title</h3>
                <p>Job description goes here...</p>
            </Card>

            {/* Elevated Card with Hover */}
            <Card variant="elevated" hoverable>
                <h3>Software Engineer</h3>
                <p>Full-time • Remote • $100k-$150k</p>
            </Card>

            {/* Gradient Card */}
            <Card variant="gradient">
                <h3 style={{ color: 'white' }}>Premium Feature</h3>
                <p style={{ color: 'white' }}>Upgrade to unlock</p>
            </Card>

            {/* Card with Header and Footer */}
            <Card
                variant="elevated"
                header={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Job Title</h3>
                        <Badge variant="success">Active</Badge>
                    </div>
                }
                footer={
                    <Button variant="primary" fullWidth>Apply Now</Button>
                }
            >
                <p>Job description and details...</p>
            </Card>

            {/* Glass Card */}
            <Card variant="glass">
                <h3>Modern Design</h3>
                <p>With frosted glass effect</p>
            </Card>
        </div>
    );
}

// ========================================
// BADGE EXAMPLES
// ========================================

function BadgeExamples() {
    return (
        <div>
            {/* Status Badges */}
            <Badge variant="success">Full-time</Badge>
            <Badge variant="info">Remote</Badge>
            <Badge variant="warning">Urgent</Badge>
            <Badge variant="danger">Closed</Badge>

            {/* Pill Badges */}
            <Badge variant="primary" pill>Featured</Badge>
            <Badge variant="success" pill>Active</Badge>

            {/* Count Badges */}
            <div style={{ position: 'relative' }}>
                <span>Notifications</span>
                <Badge count={5} variant="danger" />
            </div>

            {/* Dot Indicators */}
            <Badge dot variant="success" />
            <span>Online</span>

            {/* Sizes */}
            <Badge size="small">Small</Badge>
            <Badge size="medium">Medium</Badge>
            <Badge size="large">Large</Badge>
        </div>
    );
}

// ========================================
// AVATAR EXAMPLES
// ========================================

function AvatarExamples() {
    return (
        <div>
            {/* With Image */}
            <Avatar
                src="/path/to/image.jpg"
                alt="John Doe"
                size="medium"
            />

            {/* With Initials (no image) */}
            <Avatar alt="John Doe" size="large" />  {/* Shows "JD" */}

            {/* With Online Status */}
            <Avatar
                alt="Jane Smith"
                online
                statusPosition="bottom-right"
            />

            {/* Different Shapes */}
            <Avatar alt="User" shape="circle" />
            <Avatar alt="User" shape="square" />
            <Avatar alt="User" shape="rounded" />

            {/* Sizes */}
            <Avatar alt="User" size="small" />
            <Avatar alt="User" size="medium" />
            <Avatar alt="User" size="large" />
            <Avatar alt="User" size="xlarge" />

            {/* Clickable */}
            <Avatar
                alt="User"
                onClick={() => navigate('/profile')}
            />

            {/* Avatar Group */}
            <div className="avatar-group">
                <Avatar alt="User 1" />
                <Avatar alt="User 2" />
                <Avatar alt="User 3" />
            </div>
        </div>
    );
}

// ========================================
// MODAL EXAMPLES
// ========================================

function ModalExamples() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

            {/* Basic Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Confirm Application"
                size="medium"
            >
                <p>Are you sure you want to apply for this position?</p>
            </Modal>

            {/* Modal with Footer */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Application Form"
                size="large"
                footer={
                    <>
                        <Button variant="outline-primary" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary">Submit</Button>
                    </>
                }
            >
                <form>{/* Form fields */}</form>
            </Modal>

            {/* Danger Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Delete Job Posting"
                className="modal-danger"
            >
                <p>This action cannot be undone.</p>
            </Modal>
        </div>
    );
}

// ========================================
// DROPDOWN EXAMPLES
// ========================================

function DropdownExamples() {
    const menuItems = [
        {
            label: 'Profile',
            icon: <FaUser />,
            onClick: () => navigate('/profile')
        },
        {
            label: 'Settings',
            icon: <FaCog />,
            onClick: () => navigate('/settings')
        },
        { divider: true },
        {
            label: 'Logout',
            icon: <FaSignOutAlt />,
            onClick: handleLogout,
            className: 'text-danger'
        }
    ];

    return (
        <div>
            {/* User Menu Dropdown */}
            <Dropdown
                trigger={
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Avatar alt="John Doe" size="small" />
                        <span style={{ marginLeft: '0.5rem' }}>John Doe</span>
                    </div>
                }
                items={menuItems}
                position="bottom-right"
            />

            {/* Button Dropdown */}
            <Dropdown
                trigger={<Button variant="outline-primary">Actions</Button>}
                items={[
                    { label: 'Edit', onClick: () => { } },
                    { label: 'Share', onClick: () => { } },
                    { divider: true },
                    { label: 'Delete', onClick: () => { }, className: 'text-danger' }
                ]}
            />

            {/* With Badges */}
            <Dropdown
                trigger={<Button>Notifications</Button>}
                items={[
                    {
                        label: 'New Applications',
                        badge: '5',
                        onClick: () => { }
                    },
                    {
                        label: 'Messages',
                        badge: '12',
                        onClick: () => { }
                    }
                ]}
            />
        </div>
    );
}

// ========================================
// SEARCHBAR EXAMPLES
// ========================================

function SearchBarExamples() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const suggestions = [
        {
            title: 'Software Engineer',
            subtitle: '245 jobs available',
            icon: <FaBriefcase />
        },
        {
            title: 'Product Manager',
            subtitle: '89 jobs available',
            icon: <FaBriefcase />
        }
    ];

    const filters = [
        {
            label: 'Remote',
            count: 150,
            active: false,
            onClick: () => { }
        },
        {
            label: 'Full-time',
            count: 200,
            active: true,
            onClick: () => { }
        }
    ];

    return (
        <div>
            {/* Basic Search */}
            <SearchBar
                placeholder="Search jobs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onSearch={(data) => console.log('Search:', data.query)}
            />

            {/* With Location */}
            <SearchBar
                placeholder="Job title, keywords, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onSearch={(data) => console.log('Search:', data)}
                withLocation
            />

            {/* With Suggestions */}
            <SearchBar
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                suggestions={suggestions}
                onSuggestionClick={(suggestion) => console.log(suggestion)}
            />

            {/* With Filters */}
            <SearchBar
                placeholder="Search jobs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                withFilters
                filters={filters}
            />

            {/* Complete Example */}
            <SearchBar
                placeholder="Job title, keywords, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onSearch={(data) => {
                    setLoading(true);
                    // Perform search...
                    setTimeout(() => setLoading(false), 2000);
                }}
                suggestions={suggestions}
                onSuggestionClick={(suggestion) => {
                    setQuery(suggestion.title);
                }}
                withLocation
                withFilters
                filters={filters}
                loading={loading}
            />
        </div>
    );
}

// ========================================
// NOTIFICATION BELL EXAMPLES
// ========================================

function NotificationBellExamples() {
    return (
        <div>
            {/* Add to Navbar */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                <div>Logo</div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <NotificationBell />
                    <Avatar alt="User" size="small" />
                </div>
            </nav>
        </div>
    );
}

// ========================================
// COMPLETE PAGE EXAMPLE
// ========================================

function JobsPageExample() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="jobs-page">
            {/* Header with Search */}
            <div className="page-header">
                <h1>Find Your Dream Job</h1>
                <SearchBar
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onSearch={(data) => console.log('Searching:', data)}
                    withLocation
                />
            </div>

            {/* Job Cards Grid */}
            <div className="jobs-grid">
                <Card variant="elevated" hoverable>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <Avatar alt="Company" size="large" />
                        <Badge variant="success" pill>Remote</Badge>
                    </div>
                    <h3>Senior Software Engineer</h3>
                    <p>Tech Company Inc.</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <Badge variant="info">React</Badge>
                        <Badge variant="info">Node.js</Badge>
                        <Badge variant="info">AWS</Badge>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => setIsModalOpen(true)}
                        >
                            Apply Now
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Application Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Quick Apply"
                footer={
                    <>
                        <Button variant="outline-primary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary">Submit Application</Button>
                    </>
                }
            >
                <form>
                    {/* Form fields */}
                </form>
            </Modal>
        </div>
    );
}

export {
    ButtonExamples,
    CardExamples,
    BadgeExamples,
    AvatarExamples,
    ModalExamples,
    DropdownExamples,
    SearchBarExamples,
    NotificationBellExamples,
    JobsPageExample
};
