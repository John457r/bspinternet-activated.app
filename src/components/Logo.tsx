export const KunduDrum = ({ compact = false }: { compact?: boolean }) => (
  <div className={`relative ${compact ? 'w-3 h-7' : 'w-6 h-14'} flex flex-col items-center select-none`}>
    {/* Top Part */}
    <div className={`w-full ${compact ? 'h-3' : 'h-6'} bg-[#58595b] rounded-t-sm clip-path-drum-top`}></div>
    {/* Middle / Handle Part */}
    <div className={`${compact ? 'w-1 h-1' : 'w-2 h-2'} bg-[#58595b] -my-0.5 z-10`}></div>
    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${compact ? 'w-2 h-0.5' : 'w-4 h-1'} border-y border-[#58595b]`}></div>
    {/* Bottom Part */}
    <div className={`w-full ${compact ? 'h-3' : 'h-6'} bg-[#58595b] rounded-b-sm clip-path-drum-bottom`}></div>
    
    <style>{`
      .clip-path-drum-top {
        clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
      }
      .clip-path-drum-bottom {
        clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
      }
    `}</style>
  </div>
);

export const Logo = ({ compact = false }: { compact?: boolean }) => (
  <div className={`flex items-center ${compact ? 'gap-2' : 'gap-4 mb-12'}`}>
    <div className={`flex ${compact ? 'gap-0.5' : 'gap-1.5'}`}>
      <KunduDrum compact={compact} />
      <KunduDrum compact={compact} />
      <KunduDrum compact={compact} />
    </div>
    <span className={`text-[#80b433] font-black ${compact ? 'text-2xl' : 'text-6xl'} tracking-tighter leading-none select-none`}>
      BSP
    </span>
  </div>
);
