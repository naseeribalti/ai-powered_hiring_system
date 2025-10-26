import React from 'react';
import StatsCard from './components/StatsCard';
import ActivityFeed from './components/ActivityFeed';
import ChartWidget from './components/ChartWidget';

const AdminDashboard = ({ data, user }) => {
    const { totalUsers = 0, totalJobs = 0, totalApplications = 0, recentActivity = [] } = data || {};

    return (
        <div className="container-fluid">
            <div className="stats-grid">
                <StatsCard icon="fas fa-users" color="primary" value={totalUsers} title="Total Users" />
                <StatsCard icon="fas fa-briefcase" color="success" value={totalJobs} title="Total Jobs" />
                <StatsCard icon="fas fa-file-alt" color="warning" value={totalApplications} title="Total Applications" />
                <StatsCard icon="fas fa-heartbeat" color="info" value={100} title="Health Score" />
            </div>

            <div className="content-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h5 className="card-title"><i className="fas fa-chart-line me-2"></i>Platform Trends</h5>
                    </div>
                    <div className="card-body">
                        <ChartWidget title="User Growth" />
                        <ChartWidget title="Job Posting Trends" />
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h5 className="card-title"><i className="fas fa-stream me-2"></i>Recent Activity</h5>
                    </div>
                    <div className="card-body">
                        <ActivityFeed activities={recentActivity} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
