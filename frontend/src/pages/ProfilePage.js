import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        skills: user?.skills || '',
        experience: user?.experience || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateProfile(formData);

        if (result.success) {
            // Profile updated successfully
        }

        setLoading(false);
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <h1 className="h3 mb-4">
                        <i className="fas fa-user me-2"></i>
                        My Profile
                    </h1>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-edit me-2"></i>
                                Edit Profile
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="name" className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled
                                        />
                                        <div className="form-text">Email cannot be changed</div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">Bio</label>
                                    <textarea
                                        className="form-control"
                                        id="bio"
                                        name="bio"
                                        rows="3"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself..."
                                    ></textarea>
                                </div>

                                {user?.role === 'candidate' && (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="skills" className="form-label">Skills</label>
                                            <textarea
                                                className="form-control"
                                                id="skills"
                                                name="skills"
                                                rows="2"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                placeholder="List your skills (comma separated)"
                                            ></textarea>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="experience" className="form-label">Experience</label>
                                            <textarea
                                                className="form-control"
                                                id="experience"
                                                name="experience"
                                                rows="4"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                placeholder="Describe your work experience..."
                                            ></textarea>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-2"></i>
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                Account Information
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <strong>Role:</strong>
                                <span className={`badge ms-2 bg-${user?.role === 'admin' ? 'danger' :
                                        user?.role === 'hr' ? 'warning' : 'primary'
                                    }`}>
                                    {user?.role}
                                </span>
                            </div>

                            <div className="mb-3">
                                <strong>Member Since:</strong>
                                <div className="text-muted">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>

                            <div className="mb-3">
                                <strong>Last Updated:</strong>
                                <div className="text-muted">
                                    {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-shield-alt me-2"></i>
                                Security
                            </h5>
                        </div>
                        <div className="card-body">
                            <button className="btn btn-outline-warning w-100 mb-2">
                                <i className="fas fa-key me-2"></i>
                                Change Password
                            </button>
                            <button className="btn btn-outline-danger w-100">
                                <i className="fas fa-trash me-2"></i>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
