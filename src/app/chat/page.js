/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function safeFormatTime(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

function getSenderId(msg) {
  if (!msg || msg.sender == null) return null;
  if (typeof msg.sender === 'string') return msg.sender;
  if (typeof msg.sender === 'object' && msg.sender._id) return String(msg.sender._id);
  return String(msg.sender);
}

function ChatContent() {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageAttachment, setImageAttachment] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const commonEmojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','👍','👎','👏','🙌','👐','🤲','🤝','🙏','❤️','💔','🔥','✨','🎉','🎊','🌟','💯'];

  const messagesEndRef = useRef(null);
  const activeContactRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchParams = useSearchParams();

  const presetUserId = searchParams.get('userId') || '';
  const presetUserName = searchParams.get('userName') || '';
  const presetUserAvatar = searchParams.get('userAvatar') || '';
  const productId = searchParams.get('productId') || '';

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => { activeContactRef.current = activeContact; }, [activeContact]);

  useEffect(() => {
    fetchContacts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeContact?._id) return;
    fetchMessages(activeContact._id);
    const interval = setInterval(() => {
      if (activeContactRef.current?._id) {
        fetchMessages(activeContactRef.current._id);
        fetchContacts(true);
      }
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContact?._id]);

  useEffect(() => {
    try { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); } catch {}
  }, [messages]);

  async function fetchContacts(isSilent = false) {
    try {
      const res = await fetch('/api/chat');
      if (!res.ok) {
        if (!isSilent) setLoading(false);
        return;
      }
      let data = [];
      try {
        data = await res.json();
        if (!Array.isArray(data)) data = [];
      } catch { data = []; }

      const validData = data.filter(item => item?.contact?._id);
      let finalContacts = [...validData];

      if (presetUserId) {
        const existingContact = validData.find(c => String(c?.contact?._id) === presetUserId);
        if (!existingContact) {
          const fakeContact = { _id: presetUserId, name: presetUserName || 'Penjual', avatar: presetUserAvatar || '' };
          finalContacts = [{ contact: fakeContact, lastMessage: null, unreadCount: 0 }, ...validData];
          if (!isSilent && !activeContactRef.current) setActiveContact(fakeContact);
        } else if (!isSilent && !activeContactRef.current) {
          setActiveContact(existingContact.contact);
        }
      } else if (validData.length > 0 && !activeContactRef.current && !isSilent) {
        setActiveContact(validData[0].contact);
      }
      setContacts(finalContacts);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }

  async function fetchMessages(userId) {
    if (!userId) return;
    try {
      const res = await fetch(`/api/chat/${userId}`);
      if (!res.ok) return;
      let data = [];
      try {
        data = await res.json();
        if (!Array.isArray(data)) data = [];
      } catch { return; }

      setMessages(prev => {
        const lastPrevId = prev.length > 0 ? prev[prev.length - 1]?._id : null;
        const lastNewId = data.length > 0 ? data[data.length - 1]?._id : null;
        if (prev.length === data.length && lastPrevId === lastNewId) return prev;
        return data;
      });

      setContacts(prev => prev.map(c =>
        c?.contact?._id && String(c.contact._id) === String(userId) ? { ...c, unreadCount: 0 } : c
      ));
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size and type client-side
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB');
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setImageAttachment(data.url);
      } else {
        alert(data.error || 'Gagal mengupload gambar');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Terjadi kesalahan saat mengupload gambar');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if ((!newMessage.trim() && !imageAttachment) || !activeContact?._id) return;
    const content = newMessage.trim();
    const image = imageAttachment;
    setNewMessage('');
    setImageAttachment(null);
    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg = {
      _id: optimisticId,
      content,
      image,
      sender: 'me',
      createdAt: new Date().toISOString(),
      productContext: messages.length === 0 && productId ? { _id: productId, name: 'Produk Terkait' } : null,
    };
    setMessages(prev => [...prev, optimisticMsg]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: activeContact._id, content, image, productId: messages.length === 0 ? productId || null : null }),
      });
      if (res.ok) { fetchMessages(activeContact._id); fetchContacts(true); }
    } catch (err) { console.error('Failed to send message:', err); }
  }

  async function handleDeleteMessage(msgId) {
    if (!window.confirm('Hapus pesan ini?')) return;
    try {
      const res = await fetch(`/api/chat/message/${msgId}`, { method: 'DELETE' });
      if (res.ok) setMessages(prev => prev.map(m => m._id === msgId ? { ...m, isDeleted: true, content: '' } : m));
    } catch (err) { console.error('Failed to delete message:', err); }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f0f2f5] overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`w-full md:w-[350px] lg:w-[400px] bg-white border-r border-gray-200 flex flex-col ${activeContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 z-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)', paddingBottom: '1rem', minHeight: '64px' }}>
          <h2 className="text-xl font-bold text-gray-800">Pesan</h2>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#C62828] transition-colors">Kembali</Link>
        </div>
        <div className="flex-1 overflow-y-auto bg-white">
          {contacts.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p className="text-sm">Belum ada percakapan.</p>
              <p className="text-xs mt-1 text-gray-400">Mulai obrolan dari halaman detail produk.</p>
            </div>
          ) : (
            contacts.map(item => {
              const contact = item?.contact;
              const lastMessage = item?.lastMessage;
              const unreadCount = item?.unreadCount || 0;
              if (!contact?._id) return null;
              return (
                <div key={String(contact._id)} onClick={() => setActiveContact(contact)} className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 ${activeContact?._id === contact._id ? 'bg-gray-100/60' : ''}`}>
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name || 'User'} className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-100 shadow-sm" onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }} />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center text-[#C62828] font-bold shrink-0 border border-red-100">
                      {(contact.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-[15px] font-semibold text-gray-900 truncate">{contact.name || 'User'}</h3>
                      {isClient && lastMessage?.createdAt && (
                        <span className={`text-[11px] shrink-0 ${unreadCount > 0 ? 'text-[#C62828] font-semibold' : 'text-gray-400'}`}>
                          {safeFormatTime(lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {lastMessage ? (lastMessage.isDeleted ? '?? Pesan dihapus' : lastMessage.content || '?? Gambar') : 'Mulai obrolan baru...'}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <div className="w-5 h-5 bg-[#C62828] rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm">{unreadCount}</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#efeae2] relative ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

        {activeContact ? (
          <>
            <div className="bg-white flex items-center px-4 shrink-0 shadow-sm z-10 sticky top-0 border-b border-gray-200" style={{ paddingTop: 'max(env(safe-area-inset-top), 0.5rem)', paddingBottom: '0.5rem', minHeight: '64px' }}>
              <button onClick={() => setActiveContact(null)} className="md:hidden mr-2 p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="relative mr-3">
                {activeContact.avatar ? (
                  <img src={activeContact.avatar} alt={activeContact.name || 'User'} className="w-10 h-10 rounded-full object-cover border border-gray-200" onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }} />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center text-[#C62828] font-bold">
                    {(activeContact.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-semibold text-gray-900 truncate leading-tight">{activeContact.name || 'User'}</h2>
                <p className="text-[12px] text-gray-400 font-medium">Offline</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 z-10">
              {messages.length === 0 && (
                <div className="flex justify-center mb-6 mt-4">
                  <div className="bg-[#fff3c4] text-[#856404] px-4 py-2 rounded-lg text-xs md:text-sm text-center shadow-sm max-w-sm">
                    Mulai obrolan dengan {activeContact.name || 'User'}. Pesan Anda dienkripsi secara end-to-end.
                  </div>
                </div>
              )}
              {messages.map((msg, index) => {
                if (!msg) return null;
                const senderId = getSenderId(msg);
                const isMe = senderId === 'me' || (senderId != null && String(senderId) !== String(activeContact._id));
                const isTemp = String(msg._id || '').startsWith('temp-');
                return (
                  <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                    {isClient && isMe && !msg.isDeleted && msg._id && !isTemp && (
                      <button onClick={() => handleDeleteMessage(msg._id)} className="mr-2 self-center p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus pesan">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3 pt-2 pb-1.5 shadow-sm relative ${isMe ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'}`}>
                      <div className={`absolute top-0 w-3 h-3 ${isMe ? '-right-2 bg-[#d9fdd3]' : '-left-2 bg-white border-l border-t border-gray-100'}`} style={{ clipPath: isMe ? 'polygon(0 0, 0% 100%, 100% 0)' : 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                      {msg.isDeleted ? (
                        <p className="text-[14.5px] italic text-gray-500 pr-10 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          Pesan ini telah dihapus
                        </p>
                      ) : (
                        <>
                          {msg.productContext?.name && !isMe && (
                            <div className="mb-2 p-2 bg-gray-50/80 rounded-xl border border-gray-200 text-gray-800 flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 mb-0.5">Terkait produk:</p>
                                <p className="font-semibold text-sm line-clamp-1 leading-none">{msg.productContext.name}</p>
                              </div>
                            </div>
                          )}
                          {msg.image && (
                            <div className="mb-1">
                              <a href={msg.image} target="_blank" rel="noopener noreferrer">
                                <img src={msg.image} alt="Attachment" className="max-w-full rounded-xl object-cover max-h-64 border border-gray-200" />
                              </a>
                            </div>
                          )}
                          {msg.content && <p className="text-[14.5px] whitespace-pre-wrap break-words leading-relaxed pr-10">{msg.content}</p>}
                        </>
                      )}
                      <div className={`float-right -mb-1 ml-2 text-[10px] font-medium flex items-center gap-1 ${isMe ? 'text-green-700' : 'text-gray-400'}`}>
                        {isClient && safeFormatTime(msg.createdAt)}
                        {isMe && <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7M5 13l4 4L19 7" /></svg>}
                      </div>
                      <div className="clear-both"></div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            <div className="p-3 md:p-4 bg-[#f0f2f5] z-10 shrink-0 relative flex flex-col">
              {imageAttachment && (
                <div className="mx-auto max-w-4xl w-full mb-3 px-2">
                  <div className="relative inline-block border border-gray-300 rounded-xl bg-white p-2 shadow-sm">
                    <button type="button" onClick={() => setImageAttachment(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <img src={imageAttachment} alt="Preview" className="h-20 object-contain rounded-lg" />
                  </div>
                </div>
              )}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-4 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-64 max-h-48 overflow-y-auto z-50 grid grid-cols-6 gap-1">
                  {commonEmojis.map(emoji => (
                    <button key={emoji} type="button" onClick={() => { setNewMessage(prev => prev + emoji); setShowEmojiPicker(false); }} className="text-xl hover:bg-gray-100 p-1 rounded transition-colors">{emoji}</button>
                  ))}
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto items-end w-full">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploadingImage} className="p-2.5 hover:bg-gray-200 rounded-full transition-colors shrink-0 text-gray-500 disabled:opacity-50">
                  {isUploadingImage ? (
                    <svg className="w-6 h-6 animate-spin text-[#C62828]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                </button>
                <button type="button" onClick={() => setShowEmojiPicker(v => !v)} className={`p-2.5 hover:bg-gray-200 rounded-full transition-colors shrink-0 ${showEmojiPicker ? 'text-[#C62828] bg-gray-200' : 'text-gray-500'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <div className="flex-1 bg-white rounded-3xl border border-transparent focus-within:border-gray-300 shadow-sm flex items-end">
                  <textarea
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                    placeholder="Ketik pesan..."
                    className="flex-1 bg-transparent text-gray-900 border-none focus:ring-0 px-4 py-3 min-h-[44px] max-h-32 text-[15px] resize-none outline-none"
                    rows={1}
                    style={{ height: '44px' }}
                  />
                </div>
                <button type="submit" disabled={(!newMessage.trim() && !imageAttachment) || isUploadingImage} className={`rounded-full p-2.5 w-[44px] h-[44px] flex items-center justify-center shrink-0 transition-colors ${newMessage.trim() || imageAttachment ? 'bg-[#C62828] text-white hover:bg-[#8E0000] shadow-sm' : 'bg-gray-200 text-gray-400'}`}>
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
            <p className="text-sm text-gray-400 max-w-sm">Kirim dan terima pesan dari pembeli atau penjual secara real-time. Pesan dilindungi dengan enkripsi end-to-end.</p>
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
