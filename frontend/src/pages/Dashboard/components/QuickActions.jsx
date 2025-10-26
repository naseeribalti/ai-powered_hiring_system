// QuickActions.jsx - Reusable Quick Actions Component
import React from 'react';

const QuickActions = ({ actions = [] }) => {
    return (
        <div className="quick-actions">
            {actions.map((action, index) => (
                <button
                    key={index}
                    className={`quick-action-btn ${action.color || 'primary'}`}
                    onClick={action.action}
                    title={action.description}
                >
                    <i className={action.icon}></i>
                    <span>{action.title}</span>
                </button>
            ))}
        </div>
    );
};

export default QuickActions;
