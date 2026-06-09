"use client";

import { useEffect, useState } from "react";
import { Star, ShieldCheck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { mastersApi, MasterProfileData } from "@/services/masters.service";
import Link from "next/link";

export default function FeaturedMasters() {
  const [masters, setMasters] = useState<MasterProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const data = await mastersApi.getAllMasters();
        // Sort by rating and trust score to get top 4 real masters
        const topMasters = data
          .sort((a, b) => Number(b.rating) - Number(a.rating) || b.trustScore - a.trustScore)
          .slice(0, 4);
        setMasters(topMasters);
      } catch (err) {
        console.error("Failed to load top masters", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-background border-t border-border">
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 tracking-tight">Устоҳои Беҳтарин (Топ)</h2>
            <p className="text-muted-foreground text-lg">Устоҳои санҷидашударо бо рейтинги баланд киро кунед.</p>
          </div>
          <div className="hidden md:flex gap-3">
            <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-card hover:bg-muted text-foreground transition-colors shadow-sm"><ChevronLeft className="w-5 h-5"/></button>
            <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-card hover:bg-muted text-foreground transition-colors shadow-sm"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : masters.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">Ҳоло устоҳо дар система нестанд.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {masters.map((m, i) => (
              <Link href={`/masters/${m.id}`} key={m.id} className="bg-card rounded-[2rem] p-5 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer block">
                <div className="w-full h-52 rounded-2xl overflow-hidden mb-6 relative bg-muted">
                  <img src={m.avatar} alt={m.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {i === 0 && (
                    <div className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md bg-yellow-400 text-yellow-950">
                      <Star className="w-3 h-3 fill-current" /> TOP RATED
                    </div>
                  )}
                  {i === 1 && (
                    <div className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md bg-orange-400 text-orange-950">
                      <Star className="w-3 h-3 fill-current" /> TRENDING
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start mb-2 px-1">
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-1.5 mb-1 truncate max-w-[140px]">{m.fullName} {m.isVerified && <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{m.profession}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-muted border border-border px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-foreground">{m.rating}</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-6 px-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {m.completedJobs} корҳои анҷомёфта
                </p>
                <div className="w-full py-3.5 bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground text-center rounded-xl font-bold transition-colors">
                  Профилро дидан
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
