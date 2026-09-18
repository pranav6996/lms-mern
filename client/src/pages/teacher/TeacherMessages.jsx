import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { chatService } from '../../services/dataService';
import { useSocket } from '../../context/SocketContext';
import { MessageSquare, Send, User } from 'lucide-react';

const TeacherMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const socket = useSocket();

  useEffect(() => {
    chatService.getConversations().then((res) => {
      const convs = res.data.data.conversations || [];
      setConversations(convs);
      if (convs.length > 0) setActiveConv(convs[0]);
    });
  }, []);

  useEffect(() => {
    if (activeConv) {
      chatService.getMessages(activeConv._id).then((res) => {
        setMessages(res.data.data.messages || []);
      });
    }
  }, [activeConv]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConv) return;
    try {
      const res = await chatService.sendMessage({ conversationId: activeConv._id, content: inputMsg });
      setMessages([...messages, res.data.data.message]);
      setInputMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Teacher Messages</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Communicate directly with your students.</p>
      </div>

      <div className="card" style={{ height: '70vh', display: 'grid', gridTemplateColumns: '280px 1fr', overflow: 'hidden' }}>
        <div style={{ borderRight: '1px solid var(--border-color)', padding: '1rem', overflowY: 'auto' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Conversations</h4>
          {conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => setActiveConv(c)}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: activeConv?._id === c._id ? 'var(--bg-secondary)' : 'transparent' }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Student Chat</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.lastMessage?.content || 'No messages yet'}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', alignSelf: 'flex-start', maxWidth: '70%' }}>
                <p style={{ fontSize: '0.875rem' }}>{m.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <input type="text" className="input" placeholder="Type a message..." value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} />
            <button type="submit" className="btn btn-primary"><Send size={16} /></button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherMessages;
