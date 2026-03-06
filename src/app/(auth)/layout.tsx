export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#f8fafc] relative overflow-hidden selection:bg-accent/30Selection">
      {/* FULL-SCREEN BACKDROP: Soft Animated Gradients & Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,134,11,0.05),transparent_70%)]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/3 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[150px] animate-pulse [animation-delay:2s]"></div>
        
        {/* Floating background markers adjusted for light theme */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-slate-200 rounded-lg animate-float [animation-duration:10s]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border border-slate-200 rounded-full animate-float [animation-duration:15s] [animation-delay:2s]"></div>
      </div>

      {/* CENTERED AUTH CARD */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row bg-white rounded-[2rem] overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] min-h-[600px] border border-slate-100">
        
        {/* Left Section: Visual / Branding (Deep Slate instead of Pitch Black) */}
        <div className="w-full lg:w-[45%] bg-slate-900 relative flex flex-col items-center justify-center p-10 text-center border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
          {/* Subtle Background gradient within card */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.12),transparent_80%)]"></div>
          
          <div className="relative z-10">
            {/* Brand Mark */}
            <div className="inline-flex mb-8 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl animate-float">
              <svg viewBox="0 0 24 24" width="60" height="60" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-accent">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <path d="M12 11v6"></path>
                <path d="M9 14h6"></path>
              </svg>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight leading-tight">
              CA_<span className="text-accent">DOCUMENT</span>
            </h2>
            <p className="text-white/40 max-w-[260px] mx-auto text-base font-medium">
              Enterprise document automation for the modern firm.
            </p>
          </div>

          <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-gray-400">
              Powered by NextWave AI
            </span>
          </div>
        </div>

        {/* Right Section: Form Content */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white shrink-0">
          <div className="w-full max-w-[380px] mx-auto animate-[fadeIn_0.5s_ease-out]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
