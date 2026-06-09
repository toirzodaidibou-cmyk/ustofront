"use client";

export default function SaliheenDonate() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a1d20] mb-6 tracking-tight">БО SALIHEEN ХАЙР КАРДАН</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Шумо метавонед тавассути роҳҳои зерин хайрияи худро амалӣ созед ва дар кори нек саҳмгузор бошед.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Alif */}
          <a href="#" className="group bg-[#fcfaf8] border border-slate-100 p-8 rounded-3xl flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-[#00a859] font-bold text-2xl">Alif</span>
            </div>
            <span className="font-bold text-[#1a1d20] tracking-wide">Alif Mobi</span>
          </a>

          {/* Dushanbe City */}
          <a href="#" className="group bg-[#fcfaf8] border border-slate-100 p-8 rounded-3xl flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-[#f26522] font-bold text-2xl">DC</span>
            </div>
            <span className="font-bold text-[#1a1d20] tracking-wide">Dushanbe City</span>
          </a>

          {/* Sberbank */}
          <a href="#" className="group bg-[#fcfaf8] border border-slate-100 p-8 rounded-3xl flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-[#21a038] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="font-bold text-[#1a1d20] tracking-wide">Сбербанк</span>
          </a>

          {/* Terminals */}
          <a href="#" className="group bg-[#fcfaf8] border border-slate-100 p-8 rounded-3xl flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <span className="font-bold text-[#1a1d20] tracking-wide text-center">Терминалҳои<br/>Пардохт</span>
          </a>

        </div>

        <div className="mt-16 bg-[#fcfaf8] rounded-3xl p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/3 flex justify-center">
             {/* QR Placeholder */}
             <div className="bg-white p-4 rounded-2xl shadow-sm">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://saliheen.tj" alt="QR Code" className="w-40 h-40" />
             </div>
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl font-bold text-[#1a1d20] mb-4">Тариқи ҳамаи ҳамёнҳои мобилии Ҷумҳурии Тоҷикистон метавонед бо QR-рамзи ягона xайр намоед.</h3>
            <p className="text-slate-500 leading-relaxed">
              Варианти 2 - ба ҳамёнҳои ватанӣ дохил шавед. Ба қисмати "Ҳамаи пардохтҳо" гузашта "Хайрия/фондҳо"-ро интихоб намоед "Saliheen"-ро интихоб карда, маблағи заруриро хайр намоед. Худованд хайратонро қабул гардонад.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
