import { useState, useEffect, useRef } from 'react';
import { Send, User, Loader2, Clock } from 'lucide-react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống cuối (chỉ cuộn container nội bộ)
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  /** 1. Tải lịch sử nhắn tin */
  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/messages/${applicationId}`);
        if (isMounted) {
          setMessages(res.data.messages || []);
          // Đợi render xong rồi cuộn
          setTimeout(scrollToBottom, 50);
        }
      } catch (err) {
        console.error('Lỗi tải tin nhắn:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHistory();
    return () => { isMounted = false; };
  }, [applicationId]);

  /** 2. Socket.io: Join room & Lắng nghe tin nhắn mới */
  useEffect(() => {
    if (!socket || !connected) {
      console.log('⏳ Chat: Đang chờ socket kết nối...');
      return;
    }

    // Join phòng chat
    socket.emit('join_chat', applicationId);
    console.log(`📡 Đã join phòng: chat_${applicationId}`);

    const onNewMessage = (msg: Message) => {
      console.log('📬 Nhận tin nhắn mới:', msg);
      if (msg.applicationId === applicationId) {
        setMessages((prev) => {
          // 1. Kiểm tra nếu tin nhắn thật đã tồn tại (tránh socket lặp)
          if (prev.find(m => m.id === msg.id)) return prev;

          // 2. Nếu tin nhắn này do chính mình gửi, xoá bản ghi "temp" tương ứng
          if (msg.senderId === user?.id) {
             const withoutTemp = prev.filter(m => !m.id.toString().startsWith('temp-'));
             return [...withoutTemp, msg];
          }

          // 3. Tin nhắn từ người khác thì cứ thêm vào bình thường
          return [...prev, msg];
        });
      }
    };

    socket.on('new_message', onNewMessage);

    return () => {
      socket.emit('leave_chat', applicationId);
      socket.off('new_message', onNewMessage);
    };
  }, [socket, connected, applicationId]);

  /** 3. Cuộn khi có tin nhắn mới (chỉ cuộn nội bộ) */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /** 4. Gửi tin nhắn */
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket || !connected) return;

    const content = input.trim();
    const msgData = {
      applicationId,
      receiverId,
      content,
    };

    // Gửi qua socket
    socket.emit('send_message', msgData);

    // Cập nhật giao diện ngay lập tức (Lạc quan)
    // Tạo một bản ghi tạm để hiển thị ngay
    const tempMsg: any = {
      id: `temp-${Date.now()}`,
      senderId: user?.id,
      receiverId,
      applicationId,
      content,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-primary-600 text-white flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <User size={20} />
        </div>
        <div className="flex-1">
          <p className="font-black text-lg leading-tight">{receiverName}</p>
          <p className="text-[10px] uppercase font-bold text-primary-200 tracking-widest flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></span>
            {connected ? 'Trực tuyến' : 'Đang kết nối...'}
          </p>
        </div>
      </div>

      {/* Messages list */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50"
        style={{ scrollBehavior: 'smooth' }}
      >
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
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl font-medium text-sm shadow-sm ${
                m.senderId === user?.id 
                  ? 'bg-primary-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
              }`}>
                {m.content}
                <div className={`text-[10px] mt-1 opacity-60 flex items-center gap-1 ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                   {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   {m.id.toString().startsWith('temp-') && <Clock size={10} className="animate-pulse" />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Viết tin nhắn..."
          className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 font-medium transition-all text-sm"
          onFocus={scrollToBottom}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 transition-all transform active:scale-95 disabled:opacity-50"
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
