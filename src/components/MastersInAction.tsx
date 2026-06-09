export default function MastersInAction() {
  const STORIES = [
    { title: "Electrical Wiring", views: "1.2k views", img: "/idiboy1.png" },
    { title: "Living Room Reno", views: "856 views", img: "/idiboy2.png" },
    { title: "Pro Cooking", views: "2.4k views", img: "/idiboy3.png" },
    { title: "Custom Woodwork", views: "412 views", img: "/idiboy4.png" },
    { title: "Emergency Plumber", views: "3.1k views", img: "/idiboy5.png" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Masters in Action</h2>
            <p className="text-slate-500 text-lg">Short video highlights showcasing real work by our masters.</p>
          </div>
          <button className="text-blue-600 font-semibold hover:underline text-left sm:text-right">View All Gallery &rarr;</button>
        </div>
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar">
          {STORIES.map((s, i) => (
            <div key={i} className="min-w-[180px] md:min-w-[220px] lg:min-w-[240px] h-[320px] md:h-[400px] rounded-3xl overflow-hidden relative snap-start group cursor-pointer shadow-sm">
              <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              
              {/* Play icon indicator */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                 <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
              </div>

              <div className="absolute bottom-5 left-5 right-5">
                <h4 className="text-white font-bold mb-1.5 leading-tight text-lg">{s.title}</h4>
                <p className="text-white/80 text-xs font-medium flex items-center gap-1.5">
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                   {s.views}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
