import { useState, useEffect, useRef } from 'react';
import { Send, User, Loader2 } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Message } from '../types';

interface Props {
  applicationId: string;
  receiverId: string;
  receiverName: string;
}

const ChatWindow = ({ applicationId, receiverId, receiverName }: Props) => {
  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  /** 1. Tải lịch sử nhắn tin khi mở khung chat */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/messages/${applicationId}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.error('Lỗi tải tin nhắn:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [applicationId]);

  /** 2. Socket.io: Join room & Lắng nghe tin nhắn mới */
  useEffect(() => {
    if (!socket || !connected) return;

    // Join vào room riêng của Application này
    socket.emit('join_chat', applicationId);

    // Lắng nghe sự kiện tin nhắn mới
    socket.on('new_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leave_chat', applicationId);
      socket.off('new_message');
    };
  }, [socket, connected, applicationId]);

  /** 3. Tự động xuống cuối khi có tin nhắn mới */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** 4. Gửi tin nhắn */
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const msgData = {
      applicationId,
      receiverId,
      content: input.trim(),
    };

    socket.emit('send_message', msgData);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-primary-600 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <User size={20} />
        </div>
        <div>
          <p className="font-black text-lg leading-tight">{receiverName}</p>
          <p className="text-[10px] uppercase font-bold text-primary-200 tracking-widest flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400' : 'bg-slate-400'}`}></span>
            {connected ? 'Trực tuyến' : 'Ngoại tuyến'}
          </p>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-300">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <MessageSquare size={48} className="opacity-20" />
            <p className="font-bold">Bắt đầu trò chuyện ngay!</p>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl font-medium text-sm shadow-sm ${
                m.senderId === user?.id 
                  ? 'bg-primary-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
              }`}>
                {m.content}
                <p className={`text-[10px] mt-1 opacity-50 ${m.senderId === user?.id ? 'text-right' : 'text-left'}`}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Viết tin nhắn cho nhà tuyển dụng..."
          className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 font-medium transition-all"
        />
        <button
          type="submit"
          className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100 transition-all transform active:scale-90"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

const MessageSquare = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7.9 20 12 16H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5l-4.1 4Z" />
  </svg>
);

export default ChatWindow;
