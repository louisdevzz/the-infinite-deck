import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../components/shared/Footer';

export const MatchmakingPage: React.FC = () => {
    const navigate = useNavigate();
    const [elapsedTime, setElapsedTime] = useState(0);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format time as mm:ss
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return { minutes, seconds };
    };

    const { minutes, seconds } = formatTime(elapsedTime);

    // Simulate finding match
    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate('/duel');
        }, 5000);
        return () => clearTimeout(timeout);
    }, [navigate]);

    // Mock data for deck preview based on user provided images
    const deckPreview = [
        {
            id: 1,
            cost: 7,
            name: "Phantom",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxxxF5yEewoIMDOAWnPt0bCHlEvHbdb8jM1YYa4WpjuLlKJ2uyntxcFaZLt2FFdw1mMlXY3HdvkxjUqrHRL0wzRWzMqnuPK72CoURC5k5-iW8oN5mhCQsRqPWrSE5Mg6LugstpPpxSl2_GZMdEwN2PKPQ79BghNW-q7mYHueRk_1EHCwpDb90QfvvmhqtgUk-3fEu875B4FofILPJC4N2eo0ncmWeptVrJ4XDKVVujbPx8kqICvVlc9ItN-TbkEvlYEbog-NInKw"
        },
        {
            id: 2,
            cost: 3,
            name: "Reactor",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLyh83hsEF44CEl5VdAMkMmIjstGww-Zagjk7RH0bqx3UmFpBWN1Q4h70v1wiNP-RFU1ffPkK9MOcuG7ptFnkpAbe177m9ziZPCvlRBVSiwBPSSgM35zzoTp7aB0SDbigg1fXDT6TnMHFKfebx2nUYlmhi4Te8A_wTO3NT4ExP7NKfn01vdJ3x61rgspan5svQDcxznzCSl01_F4N4nmgiN0YRsnrPDjz9mkG3JzmQig4Ps6DLXhZosrlUxaCNGQJFbkeTKF2vog"
        },
        {
            id: 3,
            cost: 9,
            name: "Apex",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-tLAfDoy9rDmHqfoLfbT6v-5lpah5v4yeO2s9MY3uoGqOqbqfU3o7GddVbTtS9WBKwBq6tU6qq__AihsJy67jmdatvLvyTaeq69sHXs24gyKjHgqc9yX4ka5M8ozI4bGfr73Dt6ejLCZ24zfGiN65yfVhYH8hDMvZrsVLFeORT7_7p2DLcFg_Vl2Yhn_HiKxEa5_FxqV9pJGW2CXTXaT3tlwOnmFX2_VN40ylQumOixZ_EKT7EoNFdwmygsCvryt2-TjS1cJM7A",
            isApex: true
        },
        {
            id: 4,
            cost: 4,
            name: "Virus",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7k6uxTQPe9U9lj_bamFLbK57c_VPJEWGzl2zU_EfwTEDkGBkroKMHWquEKPk4fLK46O7-X1q2o0ZWCmRnoigXaUa79xinxoqBk40Tsy8NMFU8LkgFRek3JvyolutdTeqe5WLatbdzdgTWohAkU03Kb3U6nXsh4y6pUa0YDzZ1u4T_z_QdGSMGHX9ig2sZQa1k1d_r2YOavlh0jyR2M0yfSEXWZka9NDRwCwv1thwB6GMu9k48ykkHFyfrOeRoU5BcovZZRCevDQ"
        },
        {
            id: 5,
            cost: 5,
            name: "Shield",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoW_w0apgKu7L-2qStHGfuIvzbTPoFi1j-04g0kGHuLspPWQCxEBxsjzviJ_kni1QdUKzOalbRJwMnSFNL9L_6s2Kc4jzCCV9iB0VqARoYc8Eo82Ijo2eaTBfxq2aIKna4Tv2FM7uTUUNzNrTVwZ0ytMbIvhEkT17NSQ3VMV_H92-O0byo5Kgh_Wikgt2F0CXPSwmG-zqazrtQBKGuL9eAhEaubCTRIf_Li8lIuxxjGxxDDVNvugcXjmgA7wzLBDzEK-Qtw5IrcA"
        }
    ];

    return (
        <div className="flex min-h-screen w-full flex-col grid-bg overflow-x-hidden bg-background-light dark:bg-background-dark text-white selection:bg-primary/30 font-display">
            {/* Ambient Glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Main Content (Matchmaking) */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                {/* Central Status Cluster */}
                <div className="flex flex-col items-center gap-12 max-w-md w-full text-center">
                    {/* Digital Dot Spinner */}
                    <div className="dot-spinner relative size-24 grid grid-cols-3 gap-3">
                        <div className="size-3 bg-primary rounded-full shadow-[0_0_10px_#10eae6]" style={{ animationDelay: '0s' }}></div>
                        <div className="size-3 bg-primary rounded-full shadow-[0_0_10px_#10eae6]" style={{ animationDelay: '0.1s' }}></div>
                        <div className="size-3 bg-primary rounded-full shadow-[0_0_10px_#10eae6]" style={{ animationDelay: '0.2s' }}></div>
                        <div className="size-3 bg-primary rounded-full shadow-[0_0_10px_#10eae6]" style={{ animationDelay: '0.7s' }}></div>
                        <div className="size-3 border border-primary/20 rounded-full"></div>
                        <div className="size-3 bg-primary rounded-full shadow-[0_0_10px_#10eae6]" style={{ animationDelay: '0.3s' }}></div>
                        <div className="size-3 bg-primary rounded-full shadow-[0_0_10px_#10eae6]" style={{ animationDelay: '0.6s' }}></div>
                        <div className="size-3 bg-primary rounded-full shadow-[0_0_10px_#10eae6]" style={{ animationDelay: '0.5s' }}></div>
                        <div className="size-3 bg-primary rounded-full shadow-[0_0_10px_#10eae6]" style={{ animationDelay: '0.4s' }}></div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="pulse-text text-primary text-xl font-bold tracking-[0.3em] uppercase">Searching for Opponent...</h1>

                        {/* Timer Component */}
                        <div className="flex items-center justify-center gap-2 text-primary/80 font-mono">
                            <span className="text-xs uppercase tracking-widest">Time Elapsed:</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold">{minutes}</span>
                                <span className="text-[10px] opacity-50">m</span>
                                <span className="text-lg font-bold">:</span>
                                <span className="text-lg font-bold">{seconds}</span>
                                <span className="text-[10px] opacity-50">s</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Player Deck Preview - Removed as per user request */}

                {/* Cancel Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 border border-primary/30 px-10 py-2 rounded-sm text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/10 hover:border-primary transition-all group"
                >
                    <span className="group-hover:text-primary transition-colors">Cancel Search</span>
                </button>
            </main>

            <Footer />
        </div>
    );
};
