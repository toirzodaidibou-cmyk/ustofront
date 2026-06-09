export default function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-slate-50 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-[3rem] p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-blue-600/20 relative overflow-hidden">
          
          {/* Abstract Background Decoration */}
          <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-white/5 blur-[100px] rounded-full transform rotate-45 pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[100%] bg-blue-500/50 blur-[80px] rounded-full pointer-events-none" />
          
          {/* Left Text Content */}
          <div className="w-full lg:max-w-2xl relative z-10 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Are you a Skilled Professional?
            </h2>
            <p className="text-blue-100 text-lg lg:text-xl mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Join the largest premium community of masters in Tajikistan. Grow your business, manage your clients easily, and showcase your best work. Thousands of clients are waiting for your expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-slate-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-black/10">
                Become a Master Today
              </button>
              <button className="px-8 py-4 bg-transparent text-white font-bold rounded-2xl border-2 border-white/20 hover:bg-white/10 transition-all duration-300">
                Learn How It Works
              </button>
            </div>
          </div>
          
          {/* Right Mockup Graphic */}
          <div className="w-full max-w-lg relative z-10 hidden lg:block">
             <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
               {/* Mock Header */}
               <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                 <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                   <img src="/idiboy1.png" className="w-full h-full object-cover" alt="Avatar"/>
                 </div>
                 <div>
                   <div className="w-32 h-4 bg-white/30 rounded-md mb-2" />
                   <div className="w-20 h-3 bg-white/20 rounded-md" />
                 </div>
               </div>
               {/* Mock Stats */}
               <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                   <div className="w-10 h-10 rounded-full bg-blue-400/20 mb-3" />
                   <div className="w-16 h-3 bg-white/30 rounded-md mb-2" />
                   <div className="w-24 h-2 bg-white/20 rounded-md" />
                 </div>
                 <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                   <div className="w-10 h-10 rounded-full bg-green-400/20 mb-3" />
                   <div className="w-16 h-3 bg-white/30 rounded-md mb-2" />
                   <div className="w-24 h-2 bg-white/20 rounded-md" />
                 </div>
               </div>
               {/* Mock Action */}
               <div className="w-full h-14 bg-white/20 rounded-xl" />
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}
