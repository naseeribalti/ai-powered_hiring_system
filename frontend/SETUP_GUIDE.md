# AI-Powered Hiring System - Frontend Setup Guide

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Your backend API running on port 3001

### Installation Steps

1. **Navigate to the project directory:**

   ```bash
   cd ai-hiring-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=AI-Powered Hiring System
```

### Backend Connection

The frontend is configured to connect to your backend API at `http://localhost:3001/api`. Make sure your backend is running before starting the frontend.

## 📁 Project Structure

```
ai-hiring-frontend/
├── public/
│   ├── index.html          # Main HTML template
│   └── favicon.ico         # App icon
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/         # Common UI components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── jobs/           # Job-related components
│   │   └── applications/   # Application components
│   ├── pages/              # Page components
│   │   ├── LoginPage.js    # Login page
│   │   ├── RegisterPage.js # Registration page
│   │   ├── DashboardPage.js# Main dashboard
│   │   ├── JobsPage.js     # Job listings
│   │   ├── ApplicationsPage.js # Applications
│   │   └── ProfilePage.js  # User profile
│   ├── services/           # API services
│   │   └── api.js          # Axios configuration
│   ├── context/            # React contexts
│   │   └── AuthContext.js  # Authentication context
│   ├── styles/             # CSS files
│   │   ├── App.css         # Main styles
│   │   └── index.css       # Global styles
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── App.js              # Main app component
│   └── index.js            # Entry point
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## 🎨 Features

### Authentication System

- **Login/Register** - JWT-based authentication
- **Protected Routes** - Automatic redirection for unauthorized users
- **Role-based Access** - Different UI for candidates, HR, and admins
- **Token Management** - Automatic token refresh and logout

### Dashboard

- **Statistics Cards** - Overview of jobs and applications
- **Recent Activity** - Latest jobs and applications
- **Role-specific Content** - Different views for different user roles

### Job Management

- **Job Listings** - Browse all available jobs
- **Search & Filter** - Find jobs by title, company, location, or status
- **Apply to Jobs** - One-click application for candidates
- **Job Creation** - HR and admins can post new jobs

### Application Management

- **My Applications** - Candidates can track their applications
- **All Applications** - HR and admins can manage all applications
- **Status Updates** - Accept, reject, or schedule interviews
- **Application Details** - View full application information

### Profile Management

- **Edit Profile** - Update personal information
- **Skills & Experience** - Candidates can showcase their abilities
- **Account Security** - Change password and manage account

## 🔗 API Integration

The frontend connects to your backend API with the following endpoints:

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job (HR/Admin)
- `PUT /api/jobs/:id` - Update job (HR/Admin)
- `DELETE /api/jobs/:id` - Delete job (HR/Admin)
- `GET /api/jobs/my-jobs` - Get user's jobs (HR/Admin)

### Applications

- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get specific application
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get applications for specific job

### Users (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎯 User Roles

### Candidate

- Browse and search jobs
- Apply to jobs
- Track application status
- Manage profile with skills and experience

### HR Manager

- All candidate features
- Post and manage job listings
- Review and manage applications
- Update application status

### Administrator

- All HR features
- Manage users
- System administration
- Full access to all features

## 🚀 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- ESLint configuration included
- Prettier for code formatting
- Consistent naming conventions
- Component-based architecture

### Testing

- Jest and React Testing Library included
- Component testing examples
- API mocking for tests

## 🎨 Styling

### Bootstrap 5

- Responsive grid system
- Pre-built components
- Utility classes
- Dark/light theme support

### Custom CSS

- Professional color scheme
- Smooth animations
- Responsive design
- Accessibility features

### Icons

- Font Awesome icons
- Consistent iconography
- Semantic usage

## 🔒 Security

### Authentication

- JWT token storage in localStorage
- Automatic token expiration handling
- Secure API communication
- CSRF protection

### Input Validation

- Client-side form validation
- XSS prevention
- SQL injection protection
- Secure data handling

## 📱 Responsive Design

### Mobile-First Approach

- Optimized for mobile devices
- Touch-friendly interface
- Responsive navigation
- Adaptive layouts

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement
- Graceful degradation
- Cross-platform compatibility

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Setup

- Configure production API URL
- Set up environment variables
- Optimize for performance
- Enable compression

### Hosting Options

- Netlify (recommended)
- Vercel
- AWS S3 + CloudFront
- Traditional web hosting

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**

   - Check if backend is running on port 3001
   - Verify API URL in environment variables
   - Check CORS configuration

2. **Authentication Issues**

   - Clear localStorage and cookies
   - Check JWT token expiration
   - Verify backend authentication endpoints

3. **Build Errors**

   - Clear node_modules and reinstall
   - Check for missing dependencies
   - Verify Node.js version compatibility

4. **Styling Issues**
   - Check Bootstrap CSS is loaded
   - Verify Font Awesome icons
   - Clear browser cache

## 📞 Support

For technical support or questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Verify backend connectivity

## 🎉 Next Steps

1. **Start the backend server** on port 3001
2. **Install frontend dependencies** with `npm install`
3. **Start the development server** with `npm start`
4. **Create test users** with different roles
5. **Test all features** to ensure everything works
6. **Customize styling** to match your brand
7. **Deploy to production** when ready

Happy coding! 🚀
