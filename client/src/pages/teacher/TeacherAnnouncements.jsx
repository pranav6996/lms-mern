import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { announcementService, courseService } from '../../services/dataService';
import { Megaphone, Plus } from 'lucide-react';

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchAnnouncements();
    courseService.getTeacherCourses().then((res) => {
      setCourses(res.data.data.courses || []);
      if (res.data.data.courses?.length > 0) setSelectedCourse(res.data.data.courses[0]._id);
    });
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await announcementService.getAnnouncements();
      setAnnouncements(res.data.data.announcements || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      const res = await announcementService.createAnnouncement({ title, content, course: selectedCourse });
      setAnnouncements([res.data.data.announcement, ...announcements]);
      setTitle('');
      setContent('');
    } catch (err) {
      alert('Failed to post announcement');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Course Announcements</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Broadcast updates to your students in real-time.</p>
      </div>

      <form onSubmit={handlePost} className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Create Announcement</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <select className="select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <input type="text" className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="input" rows={3} placeholder="Message content..." value={content} onChange={(e) => setContent(e.target.value)} required />
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Post Announcement</button>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {announcements.map((a) => (
          <div key={a._id} className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontWeight: 700 }}>{a.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.5rem 0' }}>{a.content}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAnnouncements;
