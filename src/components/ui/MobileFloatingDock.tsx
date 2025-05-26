// components/ui/MobileFloatingDock.tsx

"use client";
import { useState } from "react";
import { IoMdHome } from "react-icons/io";
import { GoTerminal } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import Link from "next/link";
import { cn } from "@/lib/utils"; // optional utility

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export const MobileFloatingDock = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);

  const items: DockItem[] = [
    { title: "Home", icon: <IoMdHome />, href: "/" },
    ...(user
      ? [
          { title: "Notifications", icon: <GoTerminal />, href: "/notifications" },
          { title: "About", icon: <FaUser />, href: `/profile` },
          { title: "Message", icon: <AiFillMessage />, href: `/message` },
        ]
      : []),
  ];

  return (
    <div className="sm:hidden fixed bottom-5 right-5 z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-primary text-white p-4 rounded-full shadow-md hover:scale-105 transition"
      >
        ☰
      </button>

      {open && (
        <div className="absolute bottom-16 right-0 w-52 bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-3 space-y-2 transition-all">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
