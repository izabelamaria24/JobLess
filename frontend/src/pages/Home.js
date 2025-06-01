import React from "react";
import '../design/Root.css';

export default function Home() {
  return (
    <div className="root-container">
      <section className="hero-section">
        <div className="hero-text">
          <h1 className="app-title">
            Welcome to <span className="highlight">Jobless</span>
          </h1>
          <p className="app-description">
            <strong>Jobless</strong> is your personal command center for the job hunt.
            Keep track of every job you apply for, organize your resumes and cover letters, monitor deadlines, and never miss a response.
            Say goodbye to messy spreadsheets and forgotten job applications. With Jobless, everything is organized, automated, and easy to follow.
            You'll also get <span className="highlight">smart tips for resumes</span>, estimated <span className="highlight">salary ranges</span>, and real-time <span className="highlight">notifications</span> to stay on track and ahead of the competition.
          </p>
        </div>
        <img
          src="/images/JobLessHomePage.jpg"
          alt="Jobless"
          className="jobless-image"
        />
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>📂 Job Tracker</h3>
          <p>Easily manage and update all the positions you’ve applied for in one central hub.</p>
        </div>
        <div className="feature-card">
          <h3>📄 CV & Cover Letter Storage</h3>
          <p>Upload and organize your documents. Tailor each one to specific applications.</p>
        </div>
        <div className="feature-card">
          <h3>⏰ Deadline Alerts</h3>
          <p>Get notified before important deadlines or interview dates sneak up on you.</p>
        </div>
        <div className="feature-card">
          <h3>💡 Resume Tips</h3>
          <p>Improve your chances with AI-driven suggestions for your resumes and applications.</p>
        </div>
        <div className="feature-card">
          <h3>💸 Salary Insights</h3>
          <p>Access up-to-date salary expectations based on role, location, and experience.</p>
        </div>
        <div className="feature-card">
          <h3>🔔 Smart Notifications</h3>
          <p>Never miss a reply, follow-up, or application step again.</p>
        </div>
      </section>

      <section className="wave-section">
        <h2>Organize Your Job Search With Confidence</h2>
        <p>Jobless is the smart, modern solution to the chaotic job application process.</p>
      </section>
    </div>
  );
}
