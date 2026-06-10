"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1`;

export const ReelsContext = createContext<any>(null);

const INITIAL_REELS = [
  {
    id: 1,
    videoUrl: "https://videos.pexels.com/video-files/5006616/5006616-uhd_2560_1440_25fps.mp4",
    title: "Таъмири кузови мошин баъди садама",
    description: "Дар ин навор раванди пурраи барқароркунии геометрияи кузовро нишон медиҳам.",
    likes: "12.4K",
    comments: "342",
    shares: "89",
    master: {
      id: 1,
      name: "Рустам Алиев",
      profession: "Устои кузов (Костоправ)",
      city: "Ш. Душанбе",
      isVerified: true,
      trustScore: 98,
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Rustam"
    }
  },
  {
    id: 2,
    videoUrl: "https://videos.pexels.com/video-files/4488730/4488730-uhd_2560_1440_25fps.mp4",
    title: "Иваз кардани равғани BMW",
    description: "Хизматрасонии стандартии ивази равған дар 15 дақиқа. Сифати баланд кафолат дода мешавад.",
    likes: "8.1K",
    comments: "120",
    shares: "45",
    master: {
      id: 2,
      name: "Азиз Раҳимов",
      profession: "Механики калон",
      city: "Ш. Хуҷанд",
      isVerified: true,
      trustScore: 95,
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Aziz"
    }
  }
];

export const ReelsProvider = ({ children }: { children: React.ReactNode }) => {
  const [reels, setReels] = useState<any[]>([]);

  const fetchReels = async () => {
    try {
      const res = await fetch(`${API_BASE}/reels`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setReels(data);
          return;
        }
      }
      setReels(INITIAL_REELS);
    } catch {
      setReels(INITIAL_REELS);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const addReel = async (reelData: any) => {
    const newReel = {
      id: Date.now(),
      likes: "0",
      comments: "0",
      shares: "0",
      ...reelData
    };
    
    try {
      await fetch(`${API_BASE}/reels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReel)
      });
      setReels(prev => [newReel, ...prev]);
    } catch {
      // Fallback for mock state
      setReels(prev => [newReel, ...prev]);
    }
  };

  return (
    <ReelsContext.Provider value={{ reels, addReel }}>
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => useContext(ReelsContext);
