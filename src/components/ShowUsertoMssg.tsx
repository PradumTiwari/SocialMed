'use client'

import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const fetcher = async () => {
  const res = await fetch('/api/messages')
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

const ShowUserToMssg = () => {
  const { data: users, isLoading } = useSWR('usersToMessage', fetcher)
  const router = useRouter()

  const handleChatClick = (user: any) => {
    const url = `/chat/${user.userId}?` +
      new URLSearchParams({
        name: user.data.name,
        image: user.data.image || '/default-profile.png',
        username: user.data.username,
      }).toString()
    router.push(url)
  }

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>

      {isLoading ? (
        <ul className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-gray-900 p-4 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full" />
                <div>
                  <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-700 rounded" />
                </div>
              </div>
              <div className="w-2 h-2 bg-gray-700 rounded-full" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-4">
          {users?.map((user: any) => (
            <li
              key={user.userId}
              onClick={() => handleChatClick(user)}
              className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 rounded-xl transition cursor-pointer"
            >
              <Link
                href={`/profile/${user.data.username}`}
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-4"
              >
                <Image
                  src={user.data.image || '/default-profile.png'}
                  alt={user.data.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">{user.data.name}</p>
                  <p className="text-sm text-gray-400">@{user.data.username}</p>
                </div>
              </Link>

              <div className="flex flex-col items-end text-sm text-gray-400">
                <span>44m</span>
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShowUserToMssg
