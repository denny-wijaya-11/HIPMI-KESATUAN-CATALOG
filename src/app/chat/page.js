/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ChatContent() {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const commonEmojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','👍','👎','👏','🙌','👐','🤲','🤝','🙏','❤️','💔','🔥','✨','🎉','🎊','🌟','💯','👍🏻','👍🏼','👍🏽','👍🏾','👍🏿'];

  const messagesEndRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

    const presetUserId = searchParams.get('userId');
  const presetUserName = searchParams.get('userName');
  const presetUserAvatar = searchParams.get('userAvatar');
  const productId = searchParams.get('productId');

  useEffect(() => {
    fetchContacts();
    
    // Timer to update 'now' every 30s for presence tracking
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact._id);
      
      // Start polling for new messages when a contact is active
      const messageInterval = setInterval(() => {
        fetchMessages(activeContact._id);
        fetchContacts(true); // pass true to indicate silent fetch (don't set loading)
      }, 3000);
      
      return () => clearInterval(messageInterval);
    }
  }, [activeContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchContacts(isSilent = false) {
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
        
        if (presetUserId && !isSilent) {
          // If navigating from a product with a specific user
          const existingContact = data.find(c => c.contact._id === presetUserId);
          if (existingContact) {
            setActiveContact(existingContact.contact);
          } else {
            // New chat session
            setActiveContact({
              _id: presetUserId,
              name: presetUserName || 'Penjual',
              avatar: presetUserAvatar || ''
            });
          }
        } else if (data.length > 0 && !activeContact && !isSilent) {
          // No preset user, just load the first contact
          setActiveContact(data[0].contact);
        }
      }
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }

  async function fetchMessages(userId) {
    try {
      const res = await fetch(`/api/chat/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => {
          // Only update if lengths differ or the last message ID differs (to avoid constant re-renders/scrolls)
          if (prev.length !== data.length || (prev.length > 0 && data.length > 0 && prev[prev.length - 1]._id !== data[data.length - 1]._id)) {
            return data;
          }
          return prev;
        });
        // Mark as read in local state
        setContacts(prev => prev.map(c => 
          c.contact._id === userId ? { ...c, unreadCount: 0 } : c
        ));
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  }

  const fileInputRef = useRef(null);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim() && !activeContact) return;

    // We can't do optimistic UI easily if we upload image first from this same function
    // But we'll just handle text here
    const content = newMessage;
    setNewMessage(''); 

    const optimisticMsg = {
      _id: Date.now().toString(),
      content,
      sender: 'me',
      createdAt: new Date().toISOString(),
      productContext: messages.length === 0 && productId ? { _id: productId, name: 'Produk Terkait' } : null
    };
    if (content) {
      setMessages(prev => [...prev, optimisticMsg]);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeContact._id,
          content,
          productId: messages.length === 0 ? productId : null 
        })
      });

      if (res.ok) {
        fetchMessages(activeContact._id);
        fetchContacts();
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !activeContact) return;

    // Reset input
    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran gambar maksimal adalah 10 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Optimistic UI for image upload
      const optimisticMsg = {
        _id: 'temp_' + Date.now().toString(),
        content: '',
        image: URL.createObjectURL(file), // temporary local URL
        sender: 'me',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, optimisticMsg]);

      // 1. Upload image directly to ImgBB from frontend to avoid backend FormData issues
      const formDataApi = new FormData();
      formDataApi.append('image', file);
      
      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY || '2ef4c6bc48cb7fb77317eb664a773289'}`, {
        method: 'POST',
        body: formDataApi
      });
      const uploadData = await imgbbRes.json();
      
      if (!uploadData.success) {
        alert(uploadData.error?.message || 'Gagal mengupload gambar');
        // Remove optimistic msg
        setMessages(prev => prev.filter(m => m._id !== optimisticMsg._id));
        return;
      }

      // 2. Send message with image URL
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeContact._id,
          content: '',
          image: uploadData.data.url,
          productId: messages.length === 0 ? productId : null 
        })
      });

      if (res.ok) {
        fetchMessages(activeContact._id);
        fetchContacts();
      }
    } catch (err) {
      console.error('Failed to upload image', err);
      alert('Terjadi kesalahan saat mengupload gambar.');
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f0f2f5] overflow-hidden font-sans">
      {/* Sidebar - Contacts (Hidden on mobile if a chat is active) */}
      <div className={`w-full md:w-[350px] lg:w-[400px] bg-white border-r border-gray-200 flex flex-col ${activeContact ? 'hidden md:flex' : 'flex'}`}>
        <div 
          className="px-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 z-10"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)', paddingBottom: '1rem', minHeight: '64px' }}
        >
          <h2 className="text-xl font-bold text-gray-800">Pesan</h2>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#C62828] transition-colors">
            Kembali
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          {contacts.length === 0 && !presetUserId ? (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p className="text-sm">Belum ada percakapan.</p>
              <p className="text-xs mt-1 text-gray-400">Mulai obrolan dari halaman detail produk.</p>
            </div>
          ) : (
            contacts.map(({ contact, lastMessage, unreadCount }) => (
              <div 
                key={contact._id} 
                onClick={() => setActiveContact(contact)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 ${activeContact?._id === contact._id ? 'bg-gray-100/60' : ''}`}
              >
                {contact.avatar ? (
                  <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-100 shadow-sm" />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center text-[#C62828] font-bold shrink-0 border border-red-100">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[15px] font-semibold text-gray-900 truncate">{contact.name}</h3>
                    {lastMessage && (
                      <span className={`text-[11px] shrink-0 ${unreadCount > 0 ? 'text-[#C62828] font-semibold' : 'text-gray-400'}`}>
                        {new Date(lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {lastMessage ? (lastMessage.isDeleted ? '🚫 Pesan dihapus' : lastMessage.content) : 'Mulai obrolan baru...'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <div className="w-5 h-5 bg-[#C62828] rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm">
                    {unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area (Hidden on mobile if no chat is active) */}
      <div className={`flex-1 flex flex-col bg-[#efeae2] relative ${!activeContact ? 'hidden md:flex' : 'flex animate-in slide-in-from-right-2 md:animate-none duration-200'}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div 
              className="bg-white flex items-center px-4 shrink-0 shadow-sm z-10 sticky top-0 border-b border-gray-200"
              style={{ paddingTop: 'max(env(safe-area-inset-top), 0.5rem)', paddingBottom: '0.5rem', minHeight: '64px' }}
            >
              <button 
                onClick={() => setActiveContact(null)}
                className="md:hidden mr-2 p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className="relative mr-3">
                {activeContact.avatar ? (
                  <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center text-[#C62828] font-bold">
                    {activeContact.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {activeContact.lastActive && (Math.abs(now - new Date(activeContact.lastActive).getTime()) < 60000) ? (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                ) : (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-semibold text-gray-900 truncate leading-tight">{activeContact.name}</h2>
                {activeContact.lastActive && (Math.abs(now - new Date(activeContact.lastActive).getTime()) < 60000) ? (
                  <p className="text-[12px] text-green-600 font-medium">Sedang Online</p>
                ) : (
                  <p className="text-[12px] text-gray-400 font-medium">Offline</p>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-gray-400">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 z-10 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex justify-center mb-6 mt-4">
                  <div className="bg-[#fff3c4] text-[#856404] px-4 py-2 rounded-lg text-xs md:text-sm text-center shadow-sm max-w-sm">
                    Mulai obrolan dengan {activeContact.name}. Pesan Anda dienkripsi secara end-to-end.
                  </div>
                </div>
              )}
              
              {messages.map((msg, index) => {
                const isMe = msg.sender !== activeContact._id;
                
                return (
                  <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-200 group`}>
                    {/* Delete button (only for sender and not deleted) */}
                    {isMe && !msg.isDeleted && msg._id && !msg._id.toString().startsWith('temp') && (
                      <button 
                        onClick={async () => {
                          if (!window.confirm('Hapus pesan ini?')) return;
                          try {
                            const res = await fetch(`/api/chat/message/${msg._id}`, { method: 'DELETE' });
                            if (res.ok) {
                              // Update local state
                              setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isDeleted: true } : m));
                            }
                          } catch (err) {
                            console.error('Failed to delete message', err);
                          }
                        }}
                        className="mr-2 self-center p-2 text-gray-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        title="Hapus pesan"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}

                    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3 pt-2 pb-1.5 shadow-sm relative ${isMe ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'}`}>
                      
                      {/* Tail styling */}
                      <div className={`absolute top-0 w-3 h-3 ${isMe ? '-right-2 bg-[#d9fdd3]' : '-left-2 bg-white border-l border-t border-gray-100'}`} style={{ clipPath: isMe ? 'polygon(0 0, 0% 100%, 100% 0)' : 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                      
                      {msg.isDeleted ? (
                        <p className="text-[14.5px] italic text-gray-500 pr-10 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          Pesan ini telah dihapus
                        </p>
                      ) : (
                        <>
                          {/* Optional Product Context */}
                          {msg.productContext && !isMe && (
                            <div className="mb-2 p-2 bg-gray-50/80 rounded-xl border border-gray-200 text-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 mb-0.5">Terkait produk:</p>
                                <p className="font-semibold text-sm line-clamp-1 leading-none">{msg.productContext.name}</p>
                              </div>
                            </div>
                          )}

                          {msg.image && (
                            <div className="mb-1 rounded-lg overflow-hidden">
                              <img src={msg.image} alt="Attachment" className="max-w-full h-auto object-contain max-h-64 rounded-lg" />
                            </div>
                          )}

                          {msg.content && (
                            <p className="text-[14.5px] whitespace-pre-wrap break-words leading-relaxed pr-10">{msg.content}</p>
                          )}
                        </>
                      )}
                      
                      <div className={`float-right -mb-1 ml-2 text-[10px] font-medium flex items-center gap-1 ${isMe ? 'text-green-700' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        {isMe && (
                          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      <div className="clear-both"></div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Chat Input */}
            <div className="p-3 md:p-4 bg-[#f0f2f5] z-10 shrink-0 relative">
              
              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-4 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-64 max-h-48 overflow-y-auto custom-scrollbar z-50 grid grid-cols-6 gap-1">
                  {commonEmojis.map(emoji => (
                    <button 
                      key={emoji} 
                      type="button"
                      onClick={() => {
                        setNewMessage(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-xl hover:bg-gray-100 p-1 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />

              <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto items-end">
                <button 
                  type="button" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2.5 hover:bg-gray-200 rounded-full transition-colors shrink-0 ${showEmojiPicker ? 'text-[#C62828] bg-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
                
                <div className="flex-1 bg-white rounded-3xl border border-transparent focus-within:border-gray-300 shadow-sm flex items-end">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Ketik pesan..."
                    className="flex-1 bg-transparent text-gray-900 border-none focus:ring-0 px-4 py-3 min-h-[44px] max-h-32 text-[15px] resize-none outline-none custom-scrollbar"
                    rows={1}
                    style={{ height: '44px' }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`rounded-full p-2.5 w-[44px] h-[44px] flex items-center justify-center shrink-0 transition-colors ${newMessage.trim() ? 'bg-[#C62828] text-white hover:bg-[#8E0000] shadow-sm' : 'bg-gray-200 text-gray-400'}`}
                >
                  <svg className="w-5 h-5 -ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] z-10 px-4 text-center">
            <div className="w-64 h-64 md:w-80 md:h-80 relative mb-6">
              <img src="/images/MASKOT LOGO.png" alt="HIPMORA Chat" className="w-full h-full object-contain opacity-40 grayscale" />
            </div>
            <h2 className="text-2xl font-light text-gray-600 mb-2">HIPMORA Web Chat</h2>
            <p className="text-sm text-gray-400 max-w-sm">
              Kirim dan terima pesan dari pembeli atau penjual secara real-time. Pesan dilindungi dengan enkripsi end-to-end.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Terenkripsi secara End-to-end
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>}>
      <ChatContent />
    </Suspense>
  );
}
