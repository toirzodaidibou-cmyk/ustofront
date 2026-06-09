import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Reel {
  id: string | number;
  videoUrl: string;
  title: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
  master: {
    id: string | number;
    name: string;
    profession: string;
    city: string;
    isVerified: boolean;
    trustScore: number;
    avatar: string;
  };
}

interface ReelsState {
  reels: Reel[];
  setReels: (reels: Reel[]) => void;
  addReel: (reel: Reel) => void;
}

const INITIAL_REELS: Reel[] = [
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

export const useReelsStore = create<ReelsState>()(
  persist(
    (set) => ({
      reels: INITIAL_REELS,
      setReels: (reels) => set({ reels }),
      addReel: (reel) => set((state) => ({ reels: [reel, ...state.reels] })),
    }),
    {
      name: 'ustotj-reels-storage', // saves to localStorage so reels persist across refreshes
    }
  )
);
