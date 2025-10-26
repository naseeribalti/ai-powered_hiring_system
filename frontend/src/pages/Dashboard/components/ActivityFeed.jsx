// ActivityFeed.jsx - Reusable Activity Feed Component
import React from 'react';

const ActivityFeed = ({ activities = [] }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'application': return 'fas fa-file-alt';
            case 'job': return 'fas fa-briefcase';
            case 'interview': return 'fas fa-handshake';
            case 'hire': return 'fas fa-user-check';
            default: return 'fas fa-bell';
        }
    };

    const getActivityColor = (color) => {
        switch (color) {
            case 'success': return 'success';
            case 'warning': return 'warning';
            case 'info': return 'info';
            case 'danger': return 'danger';
            default: return 'primary';
        }
    };

    if (activities.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    <i className="fas fa-bell"></i>
                </div>
                <h6 className="empty-state-title">No Recent Activity</h6>
                <p className="empty-state-description">
                    Your recent activities will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="activity-feed">
            {activities.map((activity, index) => (
                <div key={index} className="activity-item">
                    <div className={`activity-icon ${getActivityColor(activity.color)}`}>
                        <i className={getActivityIcon(activity.type)}></i>
                    </div>

                    <div className="activity-content">
                        <div className="activity-title">{activity.title}</div>
                        <div className="activity-description">{activity.description}</div>
                        <div className="activity-time">{activity.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityFeed;
