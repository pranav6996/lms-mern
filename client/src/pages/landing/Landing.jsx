import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, BookOpen, Users, Award, ArrowRight, Star, Play, Shield, Zap, Globe } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>LearnHub</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/courses" className="btn btn-sm btn-secondary">Courses</Link>
            {user ? (
              <Link to="/dashboard" className="btn btn-sm btn-primary">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '8rem', paddingBottom: '5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, background: 'var(--secondary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(80px)' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', padding: '0.375rem 1rem', background: 'rgb(99 102 241 / 0.1)', borderRadius: 9999, marginBottom: '1.5rem', border: '1px solid rgb(99 102 241 / 0.2)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--primary-light)', fontWeight: 500 }}>🚀 Your Learning Journey Starts Here</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, maxWidth: 800, margin: '0 auto 1.5rem' }}>
            Learn Without Limits, <br />
            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Grow Without Boundaries</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Access world-class courses, learn from expert instructors, and build skills that matter. Join thousands of learners transforming their careers.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <Link to="/courses" className="btn btn-secondary btn-lg" style={{ fontSize: '1rem' }}>
              <Play size={18} /> Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { value: '10,000+', label: 'Active Students', icon: Users },
              { value: '500+', label: 'Expert Courses', icon: BookOpen },
              { value: '50+', label: 'Expert Teachers', icon: Award },
              { value: '95%', label: 'Success Rate', icon: Star },
            ].map((stat, i) => (
              <div key={i} style={{ padding: '1rem' }}>
                <stat.icon size={28} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Why Learn With Us?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>Everything you need to advance your skills and career</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: BookOpen, title: 'Expert-Led Courses', desc: 'Learn from industry professionals with real-world experience and proven teaching methods.' },
              { icon: Zap, title: 'Interactive Learning', desc: 'Engage with quizzes, projects, and hands-on exercises that reinforce your understanding.' },
              { icon: Shield, title: 'Verified Certificates', desc: 'Earn certificates recognized by top employers to showcase your skills and knowledge.' },
              { icon: Globe, title: 'Learn Anywhere', desc: 'Access courses on any device, anytime. Your progress syncs across all platforms.' },
              { icon: Users, title: 'Community Support', desc: 'Connect with fellow learners, share knowledge, and grow together.' },
              { icon: Star, title: 'Quality Content', desc: 'Carefully curated courses with up-to-date content and best practices.' },
            ].map((feature, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, rgb(99 102 241 / 0.15), rgb(14 165 233 / 0.15))', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <feature.icon size={22} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: 'var(--radius-lg)', padding: 'clamp(2rem, 5vw, 4rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgb(255 255 255 / 0.05)', borderRadius: '50%' }} />
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Ready to Start Learning?</h2>
            <p style={{ fontSize: '1.125rem', color: 'rgb(255 255 255 / 0.8)', maxWidth: 500, margin: '0 auto 2rem' }}>Join thousands of learners already building their future with LearnHub.</p>
            <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary-dark)', fontWeight: 600, fontSize: '1rem' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={16} color="white" />
              </div>
              <span style={{ fontWeight: 700 }}>LearnHub</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>© 2024 LearnHub LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Landing;