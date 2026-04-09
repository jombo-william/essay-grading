// src/componets/teacher/MessagesTab.jsx
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from './api.js';

export default function MessagesTab({ onToast }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/messages');
      setMessages(data.messages || []);
    } catch (err) {
      onToast(err.message || 'Failed to load messages.', 'error');
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      onToast('Please enter a message.', 'error');
      return;
    }

    setSending(true);
    try {
      await apiFetch('/send-message', {
        method: 'POST',
        body: JSON.stringify({
          receiver_id: selectedMessage.sender_id,
          subject: replySubject || `Re: ${selectedMessage.subject || 'Message'}`,
          content: replyText,
          message_type: 'answer',
        }),
      });

      onToast('✅ Reply sent successfully.');
      setReplyText('');
      setReplySubject('');
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      onToast(err.message || 'Failed to send reply.', 'error');
    } finally {
      setSending(false);
    }
  };

  // Group messages by conversation
  const conversations = messages.reduce((acc, msg) => {
    const otherUserId = msg.sender_id === 1 ? msg.receiver_id : msg.sender_id;
    const otherUserName = msg.sender_id === 1 ? msg.receiver_name : msg.sender_name;

    const key = `${Math.min(1, otherUserId)}-${Math.max(1, otherUserId)}`;
    if (!acc[key]) {
      acc[key] = {
        otherUserId,
        otherUserName,
        messages: [],
        unreadCount: 0,
      };
    }

    acc[key].messages.push(msg);
    if (!msg.is_read && msg.receiver_id === 1) {
      acc[key].unreadCount += 1;
    }

    return acc;
  }, {});

  const conversationList = Object.values(conversations).sort((a, b) => {
    const aTime = new Date(a.messages[0]?.created_at || 0);
    const bTime = new Date(b.messages[0]?.created_at || 0);
    return bTime - aTime;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '12px', color: '#000000', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '20px', marginBottom: '10px' }}>📬</div>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (conversationList.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '12px', color: '#000000', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#000000', margin: 0 }}>No messages yet</p>
        <p style={{ fontSize: '13px', color: '#000000', marginTop: '4px' }}>Messages from students will appear here</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
      {/* Messages list */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ background: '#ffffff', padding: '14px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: '700', color: '#1a2e5a' }}>
          💬 Conversations
        </div>
        <div style={{ overflowY: 'auto', maxHeight: '600px' }}>
          {conversationList.map((conv, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedMessage(conv.messages[0]);
                setReplySubject(`Re: ${conv.messages[0].subject || 'Message'}`);
              }}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e2e8f0',
                cursor: 'pointer',
                background: selectedMessage?.sender_id === conv.messages[0].sender_id ? '#eff6ff' : '#ffffff',
                color: '#000000',
                transition: 'all 0.2s',
                ':hover': { background: '#f8fafc' },
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) =>
                e.currentTarget.style.background =
                  selectedMessage?.sender_id === conv.messages[0].sender_id ? '#eff6ff' : '#ffffff'
              }
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px', marginBottom: '4px' }}>
                <div style={{ fontWeight: '600', color: '#000000', flex: 1 }}>
                  {conv.otherUserName}
                  {conv.unreadCount > 0 && (
                    <span style={{ background: '#3b82f6', color: '#fff', borderRadius: '10px', fontSize: '10px', fontWeight: '700', padding: '2px 6px', marginLeft: '6px' }}>
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <span style={{ color: '#64748b', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {new Date(conv.messages[0].created_at).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.messages[0].subject || '(no subject)'}
              </p>
              <p style={{ color: '#475569', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.messages[0].content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Message detail & reply */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        {selectedMessage ? (
          <>
            {/* Message detail */}
            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', flex: 1, overflowY: 'auto', maxHeight: '300px', background: '#ffffff', color: '#0f172a' }}>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 2px' }}>FROM</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>{selectedMessage.sender_name}</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 2px' }}>SUBJECT</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                  {selectedMessage.subject || '(no subject)'}
                </p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 2px' }}>DATE</p>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px' }}>MESSAGE</p>
                <p style={{ fontSize: '13px', color: '#0f172a', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.content}
                </p>
              </div>
            </div>

            {/* Reply form */}
            <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
              <p style={{ fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px' }}>REPLY</p>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response here..."
                style={{
                  width: '100%',
                  padding: '10px',
                  boxSizing: 'border-box',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  minHeight: '100px',
                  marginBottom: '10px',
                  resize: 'vertical',
                  color: '#000000',
                }}
              />
              <button
                onClick={handleSendReply}
                disabled={sending}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: sending ? '#cbd5e1' : '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: sending ? 'not-allowed' : 'pointer',
                }}
              >
                {sending ? '⏳ Sending...' : '✉️ Send Reply'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, background: '#ffffff', borderRadius: '12px' }}>
            <p style={{ fontSize: '32px', margin: 0 }}>👈</p>
            <p style={{ fontSize: '13px', color: '#0f172a', marginTop: '10px' }}>Select a conversation to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
