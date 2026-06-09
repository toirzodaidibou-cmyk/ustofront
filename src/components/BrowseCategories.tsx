import { Zap, Droplet, Brush, Hammer, PaintBucket, Wrench, Flame, Truck } from "lucide-react";

const CATS = [
  { name: "Electrician", icon: Zap },
  { name: "Plumber", icon: Droplet },
  { name: "Cleaner", icon: Brush },
  { name: "Builder", icon: Hammer },
  { name: "Painter", icon: PaintBucket },
  { name: "Mechanic", icon: Wrench },
  { name: "Welder", icon: Flame },
  { name: "Mover", icon: Truck },
];

export default function BrowseCategories() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Browse Categories</h2>
            <p className="text-slate-500 text-lg">Explore a wide range of specialties to find the perfect professional.</p>
          </div>
          <button className="text-blue-600 font-semibold hover:underline text-left sm:text-right">Explore all Categories &rarr;</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
          {CATS.map((c, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer group">
              <c.icon className="w-8 h-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
