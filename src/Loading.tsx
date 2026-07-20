export default function LoadingScreen({
  fullPage = true,
}: {
  fullPage?: boolean;
}) {
  return (
    <div
      className={`${fullPage ? "fixed inset-0 z-[9999]" : "relative h-[70vh] w-full rounded-sm mt-10"} flex flex-col items-center justify-center bg-background overflow-hidden`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-sm blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-sm blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-primary/5 rounded-sm blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-16">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <div className="absolute inset-0 border-[3px] border-t-primary border-r-primary/20 border-b-transparent border-l-transparent rounded-sm animate-spin" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-3 border-[2px] border-b-primary/40 border-l-transparent border-t-transparent border-r-transparent rounded-sm animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
          <div className="absolute inset-6 bg-primary/10 rounded-sm animate-pulse" />
          <span
            className="relative z-10 text-primary font-black text-5xl tracking-tighter opacity-0"
            style={{
              animation: 'entrance 0.5s ease-out forwards',
            }}
          >
            EZ
          </span>
          <div className="absolute -right-2 bottom-2 w-2.5 h-2.5 bg-primary rounded-sm animate-pulse" />
        </div>
      </div>

      <style>{`
        @keyframes entrance {
          from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
