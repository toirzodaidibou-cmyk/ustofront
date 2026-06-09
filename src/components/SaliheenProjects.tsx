import { ArrowRight } from "lucide-react";

const projects = [
  { 
    title: "Орзуи хонаи Худо", 
    sub: "Кумак ба одамон барои амалӣ кардани орзуи ҳаҷ.", 
    img: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=5cmcoJJII7U"
  },
  { 
    title: "Оби Кавсар", 
    sub: "Кандани чоҳ барои маҳаллаҳои бе об", 
    img: "https://images.unsplash.com/photo-1541888069542-0ceec93e73cc?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=oEY1UmPoZuM"
  },
  { 
    title: "Қадри волидайн", 
    sub: "Ёрӣ ба волидайне, ки фарзандҳояшонро аз даст додаанд", 
    img: "https://images.unsplash.com/photo-1498677239281-1bc8767e7136?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=oEY1UmPoZuM"
  },
  { 
    title: "Мактубҳои хурсандибахш", 
    sub: "Кумак ба оилаҳои камбизоат аз манотиқи гуногуни кишвар", 
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=oEY1UmPoZuM"
  },
  { 
    title: "Маъюбон", 
    sub: "Дастгирии муассисаҳои махсуси маъюбон", 
    img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=XMZOKZRG0rI"
  },
  { 
    title: "Тозагии ватан", 
    sub: "Дастгирии онҳое, ки баҳри тозагии ватан заҳмат мекашанд", 
    img: "https://images.unsplash.com/photo-1618477461853-cf6ed80f4886?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=bXFkgmQD5OE"
  },
  { 
    title: "Хонаи умед", 
    sub: "Тақдими хона ба оилаҳои бесарпаноҳ", 
    img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=XlPvNXd65Co"
  },
  { 
    title: "Садақаи ҷория", 
    sub: "Бунёди муассисаҳои таълимию тиббӣ", 
    img: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=qSFgc1s5aVE"
  }
];

export default function SaliheenProjects() {
  return (
    <section className="bg-[#fcfaf8] py-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="text-[#d97736] font-bold text-sm tracking-widest mb-6 uppercase">Дар бораи Салиҳин</p>
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <h2 className="text-[#1a1d20] text-3xl md:text-5xl font-bold leading-[1.2] md:w-3/5">
              Салиҳин — Ташкилоти ҷамъиятии байналмилалии хайриявӣ
            </h2>
            <p className="text-slate-600 md:w-2/5 leading-relaxed text-lg border-l-2 border-[#d97736]/30 pl-6">
              Мақсади асосии мо мусоидат ба раванди кумак ва дастгирӣ ба гурӯҳҳои осебпазир ва таъмин намудани ниёзҳои асосии онҳо мебошад.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((p, i) => (
            <a href={p.url} target="_blank" rel="noopener noreferrer" key={i} className="group relative rounded-3xl overflow-hidden cursor-pointer h-[400px] block">
              <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d20] via-[#1a1d20]/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-white text-2xl font-bold mb-3 transform group-hover:-translate-y-2 transition-transform duration-500">{p.title}</h3>
                <p className="text-white/80 text-sm mb-6 line-clamp-2 transform group-hover:-translate-y-2 transition-transform duration-500 delay-75">{p.sub}</p>
                <div className="w-12 h-12 rounded-full bg-[#d97736] flex items-center justify-center text-white transition-all duration-500 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-lg shadow-orange-900/20">
                  <ArrowRight size={20} />
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
            <button className="bg-[#1a1d20] text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-[#d97736] transition-colors">
              ҲАМАИ ЛОИҲАҲО
            </button>
        </div>
      </div>
    </section>
  );
}
