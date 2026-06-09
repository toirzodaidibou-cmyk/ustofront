import React from "react";

export function renderAvatar(avatarUrl: string | null | undefined, name: string, sizeClass: string = "w-10 h-10") {
  const isFake = !avatarUrl || avatarUrl.includes("dicebear.com") || avatarUrl.trim() === "";
  const roundedClass = sizeClass.includes("rounded-xl") ? "rounded-xl" : sizeClass.includes("rounded-2xl") ? "rounded-2xl" : "rounded-full";
  if (isFake) {
    const initials = name ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "U";
    const charCode = name ? name.charCodeAt(0) : 0;
    const gradients = [
      "from-[#2A2D34] to-[#3B4252]", 
      "from-[#e25e14] to-[#b83f0f]", 
      "from-[#1E1E24] to-[#2E2E38]", 
      "from-[#3F304F] to-[#2B1D38]", 
      "from-[#1F3A52] to-[#0F1E2D]"
    ];
    const gradient = gradients[charCode % gradients.length];
    return (
      <div className={`${sizeClass} ${roundedClass} bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold shrink-0 shadow-inner`}>
        {initials}
      </div>
    );
  }
  return <img src={avatarUrl!} alt={name} className={`${sizeClass} ${roundedClass} object-cover shrink-0 border border-stone-100`} />
}
