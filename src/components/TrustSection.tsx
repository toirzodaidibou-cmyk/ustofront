import { Shield, CheckCircle, Heart } from "lucide-react";

export default function TrustSection() {
  return (
    <section className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 lg:p-20 border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                Your Trust is Our <br/> Highest Priority
              </h2>
              <p className="text-slate-500 mb-12 text-lg lg:text-xl leading-relaxed">
                We've built a secure platform where quality professionals meet reliable customers. Peace of mind is guaranteed on every job.
              </p>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl mb-2">Background Verified</h4>
                    <p className="text-slate-500 leading-relaxed">Every master is thoroughly checked and their identity is confirmed to ensure your safety and security.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl mb-2">Escrow Protection</h4>
                    <p className="text-slate-500 leading-relaxed">Your money is safely held and released only when the job is completed to your absolute satisfaction.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Heart className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl mb-2">Genuine Feedback</h4>
                    <p className="text-slate-500 leading-relaxed">All reviews are from real customers who have actually hired the master. 100% authentic and transparent.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Images & Badge */}
            <div className="relative h-[400px] md:h-[600px] w-full hidden lg:block">
              {/* Main abstract background shape */}
              <div className="absolute inset-0 bg-orange-100/50 rounded-[3rem] transform rotate-3 scale-105" />
              
              {/* Image composition */}
              <div className="absolute inset-0 rounded-[3rem] overflow-hidden bg-slate-100 shadow-inner">
                <img src="/idiboy5.png" alt="Trust and Security" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 max-w-[280px] z-10 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-2xl tracking-tight">15k+</h4>
                    <p className="text-sm font-semibold text-slate-500">Satisfied Customers</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Trusted by thousands of households across the country for their daily service needs.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
