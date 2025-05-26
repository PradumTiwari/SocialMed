'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'

export default function ChatPage({ params }: { params: { userId: string } }) {
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || 'No Name'
  const image = searchParams.get('image') || '/default-profile.png'
  const username = searchParams.get('username') || ''

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    
  ])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((msgs) => [...msgs, { text: input.trim(), fromUser: true }])
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="flex items-center gap-4 p-4 border-b border-gray-800 bg-gray-900">
        <Image
          src={image}
          alt={name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <h1 className="text-lg font-semibold">{name}</h1>
          <p className="text-sm text-gray-400">@{username}</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xs p-3 rounded-xl ${
              m.fromUser ? 'bg-blue-600 self-end' : 'bg-gray-800 self-start'
            }`}
          >
            {m.text}
          </div>
        ))}
      </main>

      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 p-4 border-t border-gray-800 bg-gray-900"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-500 transition"
        >
          Send
        </button>
      </form>
    </div>
  )
}
