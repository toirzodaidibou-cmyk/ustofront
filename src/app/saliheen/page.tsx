import SaliheenHero from "@/components/SaliheenHero";
import SaliheenProjects from "@/components/SaliheenProjects";
import SaliheenZakat from "@/components/SaliheenZakat";
import SaliheenDonate from "@/components/SaliheenDonate";

export default function SaliheenPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SaliheenHero />
      <SaliheenProjects />
      <SaliheenDonate />
      <SaliheenZakat />
    </main>
  );
}
