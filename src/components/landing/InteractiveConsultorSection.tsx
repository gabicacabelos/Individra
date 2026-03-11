'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Sparkles, Terminal, Clock, Settings, ArrowRight, Loader2 } from 'lucide-react'

type AIResponse = {
    diagnostico: string;
    solucion: string;
    tiempoAhorrado: string;
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

export function InteractiveConsultorSection() {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<AIResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async () => {
        if (!input.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

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
            if (data.diagnostico && data.solucion && data.tiempoAhorrado) {
                setResult(data);
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

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Input Area */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group h-full"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <div className="relative h-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 justify-between min-h-[400px]">
                                <div className="space-y-4 flex-1 flex flex-col">
                                    <label htmlFor="problem-input" className="block text-sm font-medium text-neutral-300">
                                        ¿Cuál es tu mayor cuello de botella actual?
                                    </label>
                                    <textarea
                                        id="problem-input"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ej: Pierdo 3 horas al día respondiendo cuánto miden los muebles por WhatsApp y armando presupuestos en Excel..."
                                        className="w-full flex-1 min-h-[150px] bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !input.trim()}
                                    className="w-full relative px-6 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Analizando proceso...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            <span>Generar Solución con IA</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Result Area (Terminal style) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-full min-h-[400px]"
                        >
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
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
                                <div className="flex-1 flex flex-col relative overflow-hidden font-mono text-sm">
                                    <div className={`p-6 flex-1 overflow-y-auto ${result && !isLoading ? 'pb-28' : ''}`}>
                                        {!isLoading && !result && !error && (
                                            <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-4">
                                                <Terminal className="w-12 h-12 opacity-50" />
                                                <p className="text-center max-w-[250px]">
                                                    Esperando input para generar diagnóstico del sistema...
                                                </p>
                                            </div>
                                        )}

                                        {isLoading && (
                                            <div className="space-y-4 text-neutral-400">
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <span className="text-blue-400">&gt;</span> Inicializando motor de análisis...
                                                </motion.div>
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                                    <span className="text-blue-400">&gt;</span> Procesando cuello de botella...
                                                </motion.div>
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                                                    <span className="text-blue-400">&gt;</span> Diseñando arquitectura de solución...
                                                </motion.div>
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="animate-pulse">
                                                    <span className="text-violet-400">&gt;</span> Compilando reporte final_
                                                </motion.div>
                                            </div>
                                        )}

                                        {error && (
                                            <div className="text-red-400">
                                                <span className="text-red-500 font-bold">[ERROR]</span> {error}
                                            </div>
                                        )}

                                        {result && !isLoading && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="space-y-6"
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1 bg-red-500/10 p-1.5 rounded-md">
                                                            <span className="text-red-400">🔍</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-sans font-semibold mb-1">Diagnóstico Individra:</h4>
                                                            <p className="text-neutral-400 font-sans leading-relaxed">{result.diagnostico}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full h-px bg-white/5" />

                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1 bg-blue-500/10 p-1.5 rounded-md">
                                                            <Settings className="w-4 h-4 text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-sans font-semibold mb-1">Solución Propuesta:</h4>
                                                            <p className="text-neutral-400 font-sans leading-relaxed">{result.solucion}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full h-px bg-white/5" />

                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1 bg-emerald-500/10 p-1.5 rounded-md">
                                                            <Clock className="w-4 h-4 text-emerald-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-sans font-semibold mb-1">Tiempo Ahorrado:</h4>
                                                            <p className="text-emerald-400 font-sans font-medium">{result.tiempoAhorrado}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Sticky action section for result */}
                                    {result && !isLoading && (
                                        <div className="absolute bottom-0 left-0 right-0 p-6 pt-16 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent pointer-events-none flex items-end">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                                                className="w-full pointer-events-auto"
                                            >
                                                <a
                                                    href={`https://wa.me/5491160152435?text=${encodeURIComponent(`Hola Individra! Quiero solicitar un servicio basado en este diagnostico:\n\n*Diagnostico* → ${result.diagnostico}\n\n*Solucion Propuesta* → ${result.solucion}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-base font-sans font-semibold rounded-xl shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_-5px_rgba(139,92,246,0.5)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 ring-1 ring-white/10"
                                                >
                                                    <Sparkles className="w-4 h-4 text-blue-200" />
                                                    <span>Implementar este sistema</span>
                                                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                                                </a>
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
