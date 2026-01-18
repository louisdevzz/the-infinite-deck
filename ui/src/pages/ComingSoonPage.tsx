import { Link } from 'react-router-dom';
import { Header } from '../components/shared/Header';
import { Footer } from '../components/shared/Footer';

export const ComingSoonPage: React.FC = () => {
    return (
        <div className="bg-background-dark font-display text-white selection:bg-primary/30 min-h-screen flex flex-col relative overflow-hidden">
            <Header />

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
                    <div className="size-24 rounded-full border border-primary/20 flex items-center justify-center mb-8 bg-black/40 backdrop-blur tilt-center shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                        <span className="material-symbols-outlined text-5xl text-primary animate-pulse">construction</span>
                    </div>

                    <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary animate-[textShine_3s_linear_infinite]">
                        System Offline
                    </h1>

                    <div className="h-px w-32 bg-primary/50 mb-6"></div>

                    <p className="text-white/60 font-mono text-sm leading-relaxed mb-10">
                        This sector is currently under development by the core team.
                        <br />Access is restricted to Level 5 personnel.
                    </p>

                    <Link to="/" className="group relative px-8 py-3 bg-primary text-background-dark font-black tracking-[0.2em] uppercase hover:scale-105 transition-transform flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Return to Bridge
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Link>
                </div>
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-[scan_4s_ease-in-out_infinite] pointer-events-none"></div>

            <Footer />
        </div>
    );
};
