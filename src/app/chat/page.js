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
  const messagesEndRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const presetUserId = searchParams.get('userId');
  const presetUserName = searchParams.get('userName');
  const productId = searchParams.get('productId');

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact._id);
    }
  }, [activeContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchContacts() {
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
        
        if (presetUserId) {
          // If navigating from a product with a specific user
          const existingContact = data.find(c => c.contact._id === presetUserId);
          if (existingContact) {
            setActiveContact(existingContact.contact);
          } else {
            // New chat session
            setActiveContact({
              _id: presetUserId,
              name: presetUserName || 'Penjual'
            });
          }
        } else if (data.length > 0) {
          // No preset user, just load the first contact
          setActiveContact(data[0].contact);
        }
      }
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(userId) {
    try {
      const res = await fetch(`/api/chat/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // Mark as read in local state
        setContacts(prev => prev.map(c => 
          c.contact._id === userId ? { ...c, unreadCount: 0 } : c
        ));
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    const content = newMessage;
    setNewMessage(''); // optimistic clear

    // Optimistic UI update
    const optimisticMsg = {
      _id: Date.now().toString(),
      content,
      sender: 'me', // placeholder, won't match activeContact._id
      createdAt: new Date().toISOString(),
      productContext: messages.length === 0 && productId ? { _id: productId, name: 'Produk Terkait' } : null
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeContact._id,
          content,
          productId: messages.length === 0 ? productId : null // Only attach product if it's the first message
        })
      });

      if (res.ok) {
        // Refresh to get the real message with DB ID
        fetchMessages(activeContact._id);
        fetchContacts();
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden pt-16">
      {/* Sidebar - Contacts (Hidden on mobile if a chat is active) */}
      <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${activeContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-gray-800">Pesan</h2>
          <Link href="/" className="text-sm text-gray-500 hover:text-red-600">
            Tutup
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 && !presetUserId ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              Belum ada pesan. Mulai obrolan dengan penjual dari halaman produk.
            </div>
          ) : (
            contacts.map(({ contact, lastMessage, unreadCount }) => (
              <div 
                key={contact._id} 
                onClick={() => setActiveContact(contact)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 ${activeContact?._id === contact._id ? 'bg-red-50' : ''}`}
              >
                {contact.avatar ? (
                  <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-200" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 font-bold shrink-0">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{contact.name}</h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 truncate">
                    {lastMessage?.content || 'Mulai obrolan baru...'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area (Hidden on mobile if no chat is active) */}
      <div className={`flex-1 flex flex-col bg-gray-50 ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 bg-white flex items-center px-4 shrink-0 shadow-sm z-10">
              <button 
                onClick={() => setActiveContact(null)}
                className="md:hidden mr-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              {activeContact.avatar ? (
                <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200" />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 font-bold mr-3">
                  {activeContact.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-base font-semibold text-gray-900">{activeContact.name}</h2>
                <p className="text-xs text-gray-600">Penjual</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <div className="inline-block bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 shadow-sm">
                    Mulai obrolan dengan {activeContact.name}
                  </div>
                </div>
              )}
              
              {messages.map((msg, index) => {
                const isMe = msg.sender !== activeContact._id;
                
                return (
                  <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${isMe ? 'bg-red-600 text-white rounded-tr-sm' : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'}`}>
                      
                      {/* Optional Product Context */}
                      {msg.productContext && !isMe && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs border border-gray-200 text-gray-700 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden relative shrink-0">
                             {/* Product Image could go here */}
                             <div className="w-full h-full bg-gray-300"></div>
                          </div>
                          <div>
                            <p className="font-semibold line-clamp-1">{msg.productContext.name}</p>
                            <p>Terkait produk ini</p>
                          </div>
                        </div>
                      )}

                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-red-100' : 'text-gray-500'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 bg-gray-100 border-transparent text-gray-900 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-full px-4 py-2 text-sm outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5 -ml-1 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Pilih pesan untuk mulai mengobrol</h2>
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
