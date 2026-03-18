'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Sparkles, Terminal, Clock, Settings, Loader2, Mail, CheckCircle, MessageCircle } from 'lucide-react'

type AIResponse = {
    diagnostico: string;
    solucion: string;
    tiempoAhorrado: string;
    costoSetupMin: number;
    costoSetupMax: number;
    costoMensualMin: number;
    costoMensualMax: number;
    timeline: {
        fase1: string;
        fase2: string;
        fase3: string;
    };
}

const InteractiveBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const config = {
            gridSize: 40,
            gridColor: '#334155',
            particleCount: 50,
            particleSpeedMin: 0.5,
            particleSpeedMax: 5,
            particleColors: ['#ffffff', '#64748b', '#94a3b8'],
            trailLength: 100,
            backgroundColor: '#000000', // Black, matching the Hero section background
            rippleDuration: 2000,
            rippleMaxRadius: 200
        };

        const occupiedLines = {
            horizontal: new Set<number>(),
            vertical: new Set<number>()
        };

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";

        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            // Check parent client height instead of window to stay within the section bounds
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
            occupiedLines.horizontal.clear();
            occupiedLines.vertical.clear();
            particles.forEach(p => p.reset());
        };

        const createGrid = () => {
            ctx.fillStyle = config.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(51, 65, 85, 0.5)');
            gradient.addColorStop(1, 'rgba(51, 65, 85, 0)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;

            for (let y = 0; y < canvas.height; y += config.gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            for (let x = 0; x < canvas.width; x += config.gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
        };

        class Particle {
            color: string;
            speed: number;
            x: number = 0;
            y: number = 0;
            direction: 'horizontal' | 'vertical' = 'horizontal';
            trail: { x: number, y: number }[] = [];
            active: boolean = false;

            constructor() {
                this.color = config.particleColors[Math.floor(Math.random() * config.particleColors.length)];
                this.speed = Math.random() * (config.particleSpeedMax - config.particleSpeedMin) + config.particleSpeedMin;
                this.reset();
            }

            update() {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > config.trailLength) this.trail.shift();

                if (this.active) {
                    if (this.direction === 'horizontal') {
                        this.x += this.speed;
                        if (this.x > canvas!.width) {
                            this.active = false;
                            occupiedLines.horizontal.delete(this.y);
                        }
                    } else {
                        this.y += this.speed;
                        if (this.y > canvas!.height) {
                            this.active = false;
                            occupiedLines.vertical.delete(this.x);
                        }
                    }
                } else {
                    const allTrailPointsOffScreen = this.trail.every(point =>
                        (this.direction === 'horizontal' && point.x > canvas!.width) ||
                        (this.direction === 'vertical' && point.y > canvas!.height)
                    );

                    if (allTrailPointsOffScreen) {
                        this.reset();
                    }
                }
            }

            draw() {
                if (!ctx) return;
                for (let i = 0; i < this.trail.length; i++) {
                    const point = this.trail[i];
                    const alpha = (i / this.trail.length);

                    let rgbColor = this.color;
                    if (this.color.startsWith('#')) {
                        const r = parseInt(this.color.slice(1, 3), 16);
                        const g = parseInt(this.color.slice(3, 5), 16);
                        const b = parseInt(this.color.slice(5, 7), 16);
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    } else {
                        ctx.fillStyle = this.color.replace('1)', `${alpha})`);
                    }

                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            findAvailableLine() {
                const maxAttempts = 100;
                let attempts = 0;

                while (attempts < maxAttempts) {
                    if (Math.random() > 0.5) {
                        const y = Math.round(Math.random() * canvas!.height / config.gridSize) * config.gridSize;
                        if (!occupiedLines.horizontal.has(y)) {
                            this.direction = 'horizontal';
                            this.x = 0;
                            this.y = y;
                            occupiedLines.horizontal.add(y);
                            return true;
                        }
                    } else {
                        const x = Math.round(Math.random() * canvas!.width / config.gridSize) * config.gridSize;
                        if (!occupiedLines.vertical.has(x)) {
                            this.direction = 'vertical';
                            this.x = x;
                            this.y = 0;
                            occupiedLines.vertical.add(x);
                            return true;
                        }
                    }
                    attempts++;
                }
                return false;
            }

            reset() {
                if (this.findAvailableLine()) {
                    this.trail = [];
                    this.active = true;
                    this.speed = Math.random() * (config.particleSpeedMax - config.particleSpeedMin) + config.particleSpeedMin;
                } else {
                    this.active = false;
                    this.trail = [];
                }
            }
        }

        const particles = Array(config.particleCount).fill(null).map(() => new Particle());

        class Ripple {
            x: number;
            y: number;
            radius: number;
            maxRadius: number;
            startTime: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.radius = 0;
                this.maxRadius = config.rippleMaxRadius;
                this.startTime = Date.now();
            }

            update() {
                const elapsed = Date.now() - this.startTime;
                this.radius = (elapsed / config.rippleDuration) * this.maxRadius;
            }

            draw() {
                if (!ctx) return;
                const alpha = Math.max(0, 1 - (this.radius / this.maxRadius));
                ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`; // Violet tint for the ripples to fit the theme
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.stroke();

                if (Math.random() < 0.3) {
                    ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
                    ctx.font = "14px monospace";
                    const char = characters[Math.floor(Math.random() * characters.length)];
                    ctx.fillText(char, this.x + (Math.random() - 0.5) * this.radius * 2, this.y + (Math.random() - 0.5) * this.radius * 2);
                }
            }

            isComplete() {
                return this.radius >= this.maxRadius;
            }
        }

        let ripples: Ripple[] = [];

        const animate = () => {
            createGrid();

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            ripples = ripples.filter(r => !r.isComplete());
            ripples.forEach(r => {
                r.update();
                r.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleClick = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripples.push(new Ripple(x, y));
        };

        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('click', handleClick);

        // Allow layout to settle before initial resize
        setTimeout(resizeCanvas, 100);
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            const canvasToCleanup = canvasRef.current;
            if (canvasToCleanup) {
                canvasToCleanup.removeEventListener('click', handleClick);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 cursor-crosshair"
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    );
}

const DIAGNOSTIC_STORAGE_KEY = 'individra_diagnostic_usage';
const MAX_DIAGNOSTICS_PER_DAY = 2;
const HOURS_24_MS = 24 * 60 * 60 * 1000;

type DiagnosticUsage = {
    count: number;
    firstUseTimestamp: number;
};

function getDiagnosticUsage(): DiagnosticUsage {
    if (typeof window === 'undefined') return { count: 0, firstUseTimestamp: 0 };

    try {
        const stored = localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
        if (!stored) return { count: 0, firstUseTimestamp: 0 };

        const usage: DiagnosticUsage = JSON.parse(stored);
        const now = Date.now();

        // Reset if 24 hours have passed since first use
        if (usage.firstUseTimestamp && (now - usage.firstUseTimestamp) >= HOURS_24_MS) {
            localStorage.removeItem(DIAGNOSTIC_STORAGE_KEY);
            return { count: 0, firstUseTimestamp: 0 };
        }

        return usage;
    } catch {
        return { count: 0, firstUseTimestamp: 0 };
    }
}

function incrementDiagnosticUsage(): void {
    if (typeof window === 'undefined') return;

    const usage = getDiagnosticUsage();
    const now = Date.now();

    const newUsage: DiagnosticUsage = {
        count: usage.count + 1,
        firstUseTimestamp: usage.firstUseTimestamp || now
    };

    localStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(newUsage));
}

function canUseDiagnostic(): { allowed: boolean; remainingTime?: string } {
    const usage = getDiagnosticUsage();

    if (usage.count >= MAX_DIAGNOSTICS_PER_DAY) {
        const elapsed = Date.now() - usage.firstUseTimestamp;
        const remaining = HOURS_24_MS - elapsed;
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

        return {
            allowed: false,
            remainingTime: hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutos`
        };
    }

    return { allowed: true };
}

export function InteractiveConsultorSection() {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<AIResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState('')
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
    const [usageBlocked, setUsageBlocked] = useState<{ blocked: boolean; remainingTime?: string }>({ blocked: false })
    const [remainingUses, setRemainingUses] = useState<number>(MAX_DIAGNOSTICS_PER_DAY)
    const [previousPrompt, setPreviousPrompt] = useState<string>('')
    const [view, setView] = useState<'input' | 'result'>('input')

    // Check usage limit on mount
    useEffect(() => {
        const check = canUseDiagnostic();
        const usage = getDiagnosticUsage();
        setRemainingUses(MAX_DIAGNOSTICS_PER_DAY - usage.count);

        if (!check.allowed) {
            setUsageBlocked({ blocked: true, remainingTime: check.remainingTime });
        }
    }, []);

    const handleEmailSubmit = async () => {
        if (!email.trim() || !result) return;

        setEmailStatus('sending');
        try {
            const res = await fetch('/api/lead-capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    problema: previousPrompt || input, // Use previousPrompt since input is cleared after success
                    diagnostico: result.diagnostico,
                    solucion: result.solucion,
                    tiempoAhorrado: result.tiempoAhorrado,
                    costoSetupMin: result.costoSetupMin,
                    costoSetupMax: result.costoSetupMax,
                    costoMensualMin: result.costoMensualMin,
                    costoMensualMax: result.costoMensualMax,
                    timeline: result.timeline
                })
            });

            if (!res.ok) throw new Error('Error al enviar');
            setEmailStatus('sent');
        } catch {
            setEmailStatus('error');
        }
    };

    const handleGenerate = async () => {
        if (!input.trim()) return;

        // Check if input is the same as previous
        const normalizedInput = input.trim().toLowerCase();
        const normalizedPrevious = previousPrompt.trim().toLowerCase();
        if (normalizedPrevious && normalizedInput === normalizedPrevious) {
            setError('Ya analizamos este problema. Describí un proceso diferente para obtener un nuevo diagnóstico.');
            return;
        }

        // Check usage limit
        const usageCheck = canUseDiagnostic();
        if (!usageCheck.allowed) {
            setUsageBlocked({ blocked: true, remainingTime: usageCheck.remainingTime });
            setError(`Alcanzaste el límite de ${MAX_DIAGNOSTICS_PER_DAY} diagnósticos por día. Volvé en ${usageCheck.remainingTime} para intentar de nuevo.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        // Reset email field on new diagnostic
        setEmail('');
        setEmailStatus('idle');

        try {
            const res = await fetch('/api/consultor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Error al conectar con la IA');
            }

            const data = await res.json();

            // Expected data format from API
            if (data.diagnostico && data.solucion && data.tiempoAhorrado && data.timeline) {
                setResult(data);
                setView('result');
                // Store current input as previous for duplicate check
                setPreviousPrompt(input);
                // Reset input field for new diagnostic
                setInput('');
                // Increment usage count on successful diagnostic
                incrementDiagnosticUsage();

                // Update remaining uses
                const newUsage = getDiagnosticUsage();
                setRemainingUses(MAX_DIAGNOSTICS_PER_DAY - newUsage.count);

                // Update blocked state if this was the last allowed use
                const newCheck = canUseDiagnostic();
                if (!newCheck.allowed) {
                    setUsageBlocked({ blocked: true, remainingTime: newCheck.remainingTime });
                }
            } else {
                throw new Error('Formato de respuesta inválido');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-black" id="diagnostico-ia">
            {/* Background elements */}
            <InteractiveBackground />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none z-0" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-300 text-sm font-medium">
                                Consultor IA en vivo
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
                        >
                            Contanos qué te frena.<br />
                            Te diseñamos la salida en 10 segundos.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-neutral-400 text-lg max-w-2xl mx-auto"
                        >
                            Probá nuestra IA ahora mismo. Describí el proceso más lento de tu empresa y mirá cómo lo automatizaríamos.
                        </motion.p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <AnimatePresence mode="wait">
                            {view === 'input' ? (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                                    <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 min-h-[400px]">
                                        <div className="space-y-4 flex-1 flex flex-col">
                                            <label htmlFor="problem-input" className="block text-sm font-medium text-neutral-300">
                                                ¿Cuál es tu mayor cuello de botella actual?
                                            </label>
                                            <textarea
                                                id="problem-input"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Ej: Pierdo 3 horas al día respondiendo cuánto miden los muebles por WhatsApp y armando presupuestos en Excel..."
                                                className="w-full flex-1 min-h-[200px] bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                                            />
                                        </div>

                                        {error && (
                                            <p className="text-red-400 text-sm font-sans">{error}</p>
                                        )}

                                        <div>
                                            <button
                                                onClick={handleGenerate}
                                                disabled={isLoading || !input.trim() || usageBlocked.blocked}
                                                className="w-full relative px-6 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Analizando proceso...</span>
                                                    </>
                                                ) : usageBlocked.blocked ? (
                                                    <>
                                                        <Clock className="w-5 h-5" />
                                                        <span>Volvé en {usageBlocked.remainingTime}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-5 h-5" />
                                                        <span>Generar Solución con IA</span>
                                                    </>
                                                )}
                                            </button>
                                            {!usageBlocked.blocked && (
                                                <p className="text-xs text-neutral-500 text-center mt-2">
                                                    {remainingUses} diagnóstico{remainingUses !== 1 ? 's' : ''} gratuito{remainingUses !== 1 ? 's' : ''} restante{remainingUses !== 1 ? 's' : ''} hoy
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                        {/* Terminal Header */}
                                        <div className="bg-black/50 border-b border-white/10 px-4 py-3 flex items-center gap-2">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                            </div>
                                            <span className="text-neutral-500 text-xs font-mono ml-2 flex items-center gap-2">
                                                <Terminal className="w-3 h-3" />
                                                individra-diagnostic.exe
                                            </span>
                                        </div>

                                        {/* Terminal Body */}
                                        <div className="p-5 sm:p-6 font-mono text-sm max-h-[500px] overflow-y-auto custom-scrollbar relative">
                                            {result && !isLoading && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="space-y-4 pb-16"
                                                >
                                                    {/* Diagnóstico card */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.05 }}
                                                        className="relative group p-4 rounded-xl bg-gradient-to-br from-rose-500/10 via-rose-500/[0.02] to-transparent border border-rose-500/20 backdrop-blur-sm"
                                                    >
                                                        <div className="flex items-start gap-3.5">
                                                            <div className="shrink-0 w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/10 group-hover:scale-110 transition-transform">
                                                                <Sparkles className="w-4 h-4 text-rose-400" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-rose-400 font-sans font-bold text-xs uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                                    Diagnóstico Individra
                                                                    <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                                                                </h4>
                                                                <p className="text-neutral-200 font-sans text-[15px] leading-relaxed italic border-l-2 border-white/5 pl-3">
                                                                    &ldquo;{result.diagnostico}&rdquo;
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>

                                                    {/* Solución Propuesta card */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.15 }}
                                                        className="relative group p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-blue-500/[0.02] to-transparent border border-blue-500/20 backdrop-blur-sm"
                                                    >
                                                        <div className="flex items-start gap-3.5">
                                                            <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
                                                                <Settings className="w-4 h-4 text-blue-400" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-blue-400 font-sans font-bold text-xs uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                                    Estrategia de Automatización
                                                                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                                                </h4>
                                                                <p className="text-neutral-200 font-sans text-[15px] leading-relaxed">
                                                                    {result.solucion}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>

                                                    {/* Tiempo Ahorrado pill */}
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.25 }}
                                                        className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-500/30 overflow-hidden group"
                                                    >
                                                        <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
                                                            <Clock className="w-4 h-4 text-emerald-400" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-emerald-400/80 font-sans uppercase tracking-[0.2em] font-bold">Potencial de Ahorro</span>
                                                            <span className="text-xl text-emerald-100 font-sans font-black tracking-tight">{result.tiempoAhorrado}</span>
                                                        </div>
                                                        <div className="ml-auto px-2 py-1 bg-emerald-500/20 rounded-md border border-emerald-500/30 animate-pulse">
                                                            <span className="text-[10px] text-emerald-400 font-bold">ROI POSITIVO</span>
                                                        </div>
                                                    </motion.div>

                                                    {/* Premium Lockdown Section */}
                                                    {emailStatus !== 'sent' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="relative mt-2 rounded-xl border border-white/5 bg-white/[0.02] p-4 overflow-hidden group"
                                                        >
                                                            <div className="space-y-3 opacity-20 grayscale blur-[2px] pointer-events-none transition duration-500 group-hover:opacity-10 group-hover:blur-[4px]">
                                                                {[
                                                                    { title: 'Timeline Detallado', desc: 'Fases, hitos y fechas clave' },
                                                                    { title: 'Costos Estimados', desc: 'Setup, licencias y mantenimiento' }
                                                                ].map((item, i) => (
                                                                    <div key={i} className="flex gap-3">
                                                                        <div className="w-8 h-8 rounded bg-white/10 shrink-0" />
                                                                        <div className="space-y-1.5 flex-1">
                                                                            <div className="h-2 w-32 bg-white/20 rounded" />
                                                                            <div className="h-2 w-full bg-white/10 rounded" />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                                                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
                                                                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                                                    <span className="text-xl">💎</span>
                                                                </div>
                                                                <p className="text-white font-bold text-center text-sm mb-1 uppercase tracking-widest">
                                                                    Análisis Premium Bloqueado
                                                                </p>
                                                                <p className="text-neutral-400 text-[11px] text-center max-w-[200px] font-sans">
                                                                    Ingresá tu mail para recibir el roadmap técnico, costos y tiempos estimados.
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {/* Success message */}
                                                    {emailStatus === 'sent' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center"
                                                        >
                                                            <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                                            <p className="text-emerald-300 font-bold text-sm mb-1">¡Reporte enviado!</p>
                                                            <p className="text-neutral-400 text-xs font-sans">
                                                                Revisá tu bandeja de entrada (y spam por las dudas).
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Sticky action section */}
                                        {result && !isLoading && (
                                            <div className="sticky bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent z-30">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 25 }}
                                                    className="w-full space-y-3"
                                                >
                                                    {/* Email capture */}
                                                    {emailStatus !== 'sent' ? (
                                                        <div className="relative group">
                                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-blue-600/50 rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition duration-500" />
                                                            <div className="relative bg-[#0a0a0f]/90 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                                                <div className="flex flex-col sm:flex-row gap-2.5">
                                                                    <div className="flex-1 relative">
                                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                                                            <Mail className="w-4 h-4" />
                                                                        </div>
                                                                        <input
                                                                            type="email"
                                                                            value={email}
                                                                            onChange={(e) => setEmail(e.target.value)}
                                                                            onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                                                                            placeholder="tu@email.com"
                                                                            className="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500/50 transition-all font-sans"
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        onClick={handleEmailSubmit}
                                                                        disabled={!email.trim() || emailStatus === 'sending'}
                                                                        className="shrink-0 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-[0.97] transition-all disabled:opacity-40 flex items-center justify-center gap-2 group/btn"
                                                                    >
                                                                        {emailStatus === 'sending' ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                                                                        )}
                                                                        <span>Desbloquear Roadmap</span>
                                                                    </button>
                                                                </div>
                                                                {emailStatus === 'error' && (
                                                                    <p className="text-red-400 text-[10px] mt-2 flex items-center gap-1 font-sans font-medium">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                                        Error al enviar. Intentá de nuevo.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : null}

                                                    {/* Nuevo Diagnóstico - solo si quedan intentos */}
                                                    {remainingUses > 0 && (
                                                        <button
                                                            onClick={() => {
                                                                setView('input');
                                                                setInput('');
                                                                setError(null);
                                                            }}
                                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-neutral-300 text-sm font-semibold rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Sparkles className="w-4 h-4" />
                                                            Nuevo Diagnóstico ({remainingUses} restante{remainingUses !== 1 ? 's' : ''})
                                                        </button>
                                                    )}

                                                    {/* WhatsApp CTA */}
                                                    <a
                                                        href={`https://wa.me/5491160152435?text=${encodeURIComponent(`Hola Individra! Quiero solicitar un servicio basado en este diagnostico:\n\n*Diagnostico* → ${result.diagnostico}\n\n*Solucion Propuesta* → ${result.solucion}`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group relative inline-flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-xl overflow-hidden font-sans font-black text-xs uppercase tracking-[0.15em] text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                                                    >
                                                        <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500" />
                                                        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-emerald-500 to-green-400" />
                                                        <MessageCircle className="relative w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                                        <span className="relative">Hablar con un Humano → WhatsApp</span>
                                                    </a>
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
        )
    }
