import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Button, Container, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { Greeting } from './Greeting';
import { CreateGreeting } from "./CreateGreeting";
import { Header } from '../../components/shared/Header';
import { Footer } from '../../components/shared/Footer';

export function StarterPage() {
    const currentAccount = useCurrentAccount();
    const [greetingId, setGreeting] = useState(() => {
        const hash = window.location.hash.slice(1);
        return isValidSuiObjectId(hash) ? hash : null;
    });

    return (
        <div className="bg-background-dark font-display text-white selection:bg-primary/30 min-h-screen flex flex-col relative overflow-hidden">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 overflow-auto">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                <div className="max-w-4xl w-full bg-black/40 backdrop-blur border border-primary/20 p-8 rounded-xl shadow-[0_0_50px_rgba(0,229,255,0.1)]">
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <Heading size="6" className="uppercase tracking-widest text-primary">Sui Network Uplink</Heading>
                        <Box style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            {currentAccount && (
                                <Button
                                    variant="soft"
                                    onClick={() => {
                                        window.open(`https://faucet.sui.io/?address=${currentAccount.address}`, '_blank');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Get Testnet SUI
                                </Button>
                            )}
                            <ConnectButton />
                        </Box>
                    </div>

                    <Container>
                        <div style={{ minHeight: 400 }}>
                            {currentAccount ? (
                                greetingId ? (
                                    <Greeting id={greetingId} />
                                ) : (
                                    <CreateGreeting
                                        onCreated={(id) => {
                                            window.location.hash = id;
                                            setGreeting(id);
                                        }}
                                    />
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <span className="material-symbols-outlined text-6xl text-white/20 mb-4">wifi_off</span>
                                    <Heading size="4" color="gray">Connection Required</Heading>
                                    <p className="text-white/40 mt-2">Please connect your wallet to interact with the Sui Devnet/Testnet.</p>
                                </div>
                            )}
                        </div>
                    </Container>
                </div>
            </main>

            <Footer />
        </div>
    );
}
