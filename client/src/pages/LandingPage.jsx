import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import {
  ArrowRight, Users, Zap, Shield, Star, ClipboardList, Trophy,
  Flame, Lock, Globe, Timer, MessageCircle, ChevronRight, Gamepad2,
  Hash, Play, HandHeart
} from 'lucide-react';
import { SPORTS_CATEGORIES, GAMING_CATEGORIES } from '../utils/constants';
import { SPORT_IMAGES } from '../utils/sportImages';
import LoginGate from '../components/common/LoginGate';

/* ── Floating Particle ── */
const Particle = ({ x, y, size, delay, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
    animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration: 3 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

/* ── Ticker item ── */
const TICKER_ITEMS = [
  'Cricket at Main Ground',
  'BGMI Squad — 3 spots left',
  'Football 5v5',
  'Badminton Doubles',
  'VALORANT Ranked',
  'Basketball 3x3',
  'Swimming Time Trial',
  'FIFA Tournament',
  'Volleyball Mixed',
  'Free Fire Scrims',
];

const PARTICLES = [
  { x: 10, y: 20, size: 6, delay: 0, color: '#f97316' },
  { x: 85, y: 15, size: 4, delay: 1, color: '#f97316' },
  { x: 70, y: 60, size: 8, delay: 0.5, color: '#fb923c44' },
  { x: 20, y: 75, size: 5, delay: 1.5, color: '#f9731644' },
  { x: 90, y: 80, size: 6, delay: 2, color: '#f97316' },
  { x: 45, y: 10, size: 3, delay: 0.8, color: '#fb923c' },
  { x: 60, y: 90, size: 5, delay: 1.2, color: '#f9731666' },
];

const ROTATING_WORDS = ['Cricket', 'BGMI', 'Football', 'Badminton', 'Valorant', 'Basketball', 'Real Cricket'];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 28 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const LandingPage = () => {
  const [loginGate, setLoginGate] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Cricket');
  const [wordIdx, setWordIdx] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const MOCK_CARDS = [
    { sport: 'Cricket', title: 'Evening Match', venue: 'Main Ground', players: '8 / 11', time: '2h 30m', miniTitle: 'Nets Practice', filled: 2, total: 4 },
    { sport: 'BGMI', title: 'Erangel Scrims', venue: 'Online Lobby', players: '3 / 4', time: '15 mins', miniTitle: 'BGMI Squad', filled: 3, total: 4 },
    { sport: 'Football', title: 'Weekend League', venue: 'Turf A', players: '10 / 14', time: 'Tomorrow', miniTitle: '5v5 Turf', filled: 4, total: 5 },
    { sport: 'Badminton', title: 'Doubles Practice', venue: 'Indoor Court 2', players: '2 / 4', time: '45 mins', miniTitle: 'Singles Match', filled: 1, total: 2 },
    { sport: 'Valorant', title: 'Ranked Push', venue: 'Mumbai Server', players: '4 / 5', time: 'Starting now', miniTitle: 'Swiftplay', filled: 2, total: 5 },
    { sport: 'Basketball', title: '3v3 Pickup', venue: 'North Court', players: '5 / 6', time: '1h 15m', miniTitle: 'Shootaround', filled: 1, total: 3 },
    { sport: 'Real Cricket', title: 'Tournament Final', venue: 'Online Lobby', players: '1 / 2', time: '10 mins', miniTitle: 'Friendly Match', filled: 1, total: 2 },
  ];
  const activeMock = MOCK_CARDS[wordIdx];

  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % ROTATING_WORDS.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden bg-white">

      {/* ═══════════════════════════════════════════════════
          HERO — Light theme
      ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white"
      >
        {/* Animated grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#f97316 1px,transparent 1px),linear-gradient(90deg,#f97316 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-orange-100 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-orange-50 rounded-full blur-[80px]" />
          <div className="absolute bottom-20 left-10 w-[200px] h-[200px] bg-orange-100 rounded-full blur-[60px]" />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
        </div>

        {/* Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-[95%] max-w-[1600px] mx-auto pt-24 pb-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: Copy */}
            <motion.div
              variants={stagger} initial="hidden" animate="show"
              className="lg:col-span-6"
            >
              {/* Live badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 mb-8">
                <span className="flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  Live for SRM AP students
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                variants={fadeUp}
                className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-none text-slate-900 uppercase tracking-tighter mb-4"
              >
                Find Your<br />
                <span className="relative inline-block">
                  <span className="text-orange-500">Crew.</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-1 bg-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>

              {/* Rotating sport word */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6 h-12">
                <span className="text-slate-600 text-xl sm:text-2xl font-bold uppercase tracking-tight">Play</span>
                <div className="overflow-hidden h-12 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIdx}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="text-xl sm:text-2xl font-black text-orange-500 uppercase tracking-tight block"
                    >
                      {ROTATING_WORDS[wordIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-slate-600 text-xl sm:text-2xl font-bold uppercase tracking-tight">Together.</span>
              </motion.div>

              <motion.p variants={fadeUp} className="text-slate-600 text-lg leading-relaxed mb-10 max-w-xl">
                CrewUp exclusively connects SRM AP students for sports and gaming. Create an activity, fill your squad, and play — no more begging in WhatsApp groups.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
                <SignedOut>
                  <Link to="/sign-up" id="hero-cta-btn" className="btn-primary py-4 px-8 text-base shadow-orange-500/20 shadow-lg hover:shadow-orange-500/40 transition-all">
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => setLoginGate(true)}
                    className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-8 py-4 text-sm uppercase tracking-wider transition-all duration-200 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 rounded-sm"
                  >
                    Explore Activities <ChevronRight className="w-4 h-4" />
                  </button>
                </SignedOut>
                <SignedIn>
                  <Link to="/dashboard" className="btn-primary py-4 px-8 text-base shadow-orange-500/20 shadow-lg hover:shadow-orange-500/40 transition-all">
                    Go to Dashboard <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/feed" className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-8 py-4 text-sm uppercase tracking-wider transition-all hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 rounded-sm">
                    Browse Feed <ChevronRight className="w-4 h-4" />
                  </Link>
                </SignedIn>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeUp} className="flex items-center gap-8 pt-8 border-t border-orange-100">
                {[
                  { value: '12+', label: 'Categories' },
                  { value: 'Live', label: 'Real-time Chat' },
                  { value: 'Free', label: 'Forever' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="font-display font-black text-2xl text-slate-900">{value}</div>
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-6 hidden lg:flex flex-col gap-4 relative -ml-8 -mt-12"
            >
              {/* Main activity card mockup */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white border-2 border-orange-100 rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="relative h-80 overflow-hidden bg-slate-900">
                  <AnimatePresence mode="popLayout">
                    <motion.img 
                      key={activeMock.sport}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={SPORT_IMAGES[activeMock.sport]} 
                      alt={activeMock.sport} 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest">Open</div>
                  <div className="absolute bottom-3 left-4">
                    <AnimatePresence mode="popLayout">
                      <motion.div 
                        key={activeMock.sport + 'labels'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="text-white/80 text-xs font-semibold mb-0.5">{activeMock.sport}</div>
                        <div className="text-white font-black text-xl uppercase tracking-tight">{activeMock.title}</div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 text-center border-t border-orange-100 bg-orange-50/50">
                  <AnimatePresence mode="popLayout">
                    <motion.div key={activeMock.venue} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="text-xs text-slate-500 font-semibold">Venue</div>
                      <div className="text-xs text-slate-900 font-bold">{activeMock.venue}</div>
                    </motion.div>
                    <motion.div key={activeMock.players} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                      <div className="text-xs text-slate-500 font-semibold">Players</div>
                      <div className="text-xs text-slate-900 font-bold">{activeMock.players}</div>
                    </motion.div>
                    <motion.div key={activeMock.time} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                      <div className="text-xs text-slate-500 font-semibold">Starts in</div>
                      <div className="text-xs text-orange-600 font-bold">{activeMock.time}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Two small floating cards */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="bg-white border-2 border-orange-100 rounded-2xl p-4 shadow-xl flex flex-col justify-between"
                >
                  <AnimatePresence mode="popLayout">
                    <motion.div 
                      key={activeMock.sport + 'mini'} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      transition={{ duration: 0.4 }}
                    >
                      <div className="text-slate-900 font-black text-sm uppercase tracking-tight">{activeMock.miniTitle}</div>
                      <div className="text-slate-500 text-xs font-semibold mt-1">{activeMock.total - activeMock.filled} spots left</div>
                      <div className="mt-2 flex gap-1">
                        {[...Array(activeMock.total)].map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i < activeMock.filled ? 'bg-orange-500' : 'bg-orange-100'}`} />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-600 text-xs font-black uppercase tracking-wider">Private</span>
                  </div>
                  <div className="text-slate-900 font-black text-sm uppercase">Crew Code</div>
                  <div className="mt-2 bg-white rounded-lg px-3 py-1.5 text-orange-600 font-black text-sm tracking-widest border border-orange-100">CU-4BX9KJ</div>
                </motion.div>
              </div>

              {/* Live notification */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1.4 }}
                className="absolute -right-2 top-[60%] bg-white rounded-2xl shadow-xl p-3.5 flex items-center gap-3 border-2 border-orange-100 max-w-[200px]"
              >
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">Just now</div>
                  <div className="text-xs font-black text-slate-900">Rahul joined your crew!</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scrolling ticker */}
        <div className="absolute bottom-0 left-0 right-0 bg-orange-50 border-t border-orange-100 py-3 overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="flex gap-12 whitespace-nowrap"
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-orange-600/80 text-xs font-bold uppercase tracking-widest shrink-0">
                {item}
                <span className="mx-6 text-orange-400/40">◆</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BANNER
      ═══════════════════════════════════════════════════ */}
      <section className="bg-orange-500 py-12 border-b border-orange-600">
        <div className="w-[95%] max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: '12+', label: 'Sports & Games', icon: Trophy },
              { val: 'Real-time', label: 'Squad Chat', icon: MessageCircle },
              { val: 'Public', label: '& Private Events', icon: Globe },
              { val: 'Crew', label: 'Codes to Join', icon: Hash },
            ].map(({ val, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Icon className="w-6 h-6 text-white mx-auto mb-3" />
                <div className="font-display font-black text-3xl text-white mb-1">{val}</div>
                <div className="text-orange-100 text-xs font-semibold uppercase tracking-widest">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section className="bg-orange-50/50 py-24">
        <div className="w-[95%] max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-5">
              <Zap className="w-3.5 h-3.5" /> Simple Process
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-slate-900 uppercase tracking-tighter">
              Play in <span className="text-orange-600">3 Steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[30%] right-[30%] h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

            {[
              { step: '01', title: 'Create Activity', desc: 'Set sport, venue, date & time. Choose Public or Private with a unique Crew Code.', icon: ClipboardList, color: 'bg-orange-500' },
              { step: '02', title: 'Crew Joins', desc: 'Teammates find you on the feed or enter your Crew Code. Real-time waitlist if full.', icon: Users, color: 'bg-orange-400' },
              { step: '03', title: 'Game On!', desc: 'Timer counts down, game auto-starts. Chat in-app, then go play.', icon: Trophy, color: 'bg-orange-500' },
            ].map(({ step, title, desc, icon: Icon, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="relative bg-white rounded-3xl p-8 group overflow-hidden border-2 border-orange-100 hover:border-orange-300 shadow-xl shadow-orange-100/50 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 font-display font-black text-[120px] text-orange-500/5 leading-none translate-x-6 -translate-y-4 pointer-events-none select-none">{step}</div>
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-bold text-orange-500 tracking-widest mb-2 uppercase">Step {step}</div>
                <h3 className="font-display font-black text-xl text-slate-900 mb-3 uppercase tracking-tight">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BENTO FEATURES GRID
      ═══════════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="w-[95%] max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-5">
              <Star className="w-3.5 h-3.5" /> Features
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-slate-900 uppercase tracking-tighter">
              Built for <span className="text-orange-600">Campus Life</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Big card — public/private */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="md:col-span-2 lg:col-span-1 bg-white rounded-3xl p-8 border-2 border-orange-100 shadow-xl shadow-orange-50/50 group cursor-default"
            >
              <div className="flex gap-3 mb-6">
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 text-xs font-black uppercase tracking-wider">Public</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-600 text-xs font-black uppercase tracking-wider">Private</span>
                </div>
              </div>
              <h3 className="font-display font-black text-2xl text-slate-900 uppercase tracking-tight mb-3">Public & Private Events</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Open events appear on the feed for anyone to join. Private events are invite-only — share the unique <span className="text-orange-600 font-bold">CU-XXXXXX</span> Crew Code with your friends only.</p>
              <div className="mt-6 bg-orange-50 rounded-2xl px-5 py-3 flex items-center justify-between border border-orange-100">
                <span className="text-slate-500 text-xs font-semibold">Crew Code</span>
                <span className="text-orange-600 font-black tracking-widest">CU-K9XMQP</span>
              </div>
            </motion.div>

            {/* Countdown timer card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white border-2 border-orange-100 rounded-3xl p-8 shadow-xl shadow-orange-50/50 group cursor-default"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                <Timer className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-tight mb-2">Live Countdown</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Every activity has a live countdown. When time hits zero, the game auto-starts. Or the host can manually kick it off earlier.</p>
              <div className="mt-5 flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5">
                <Timer className="w-4 h-4 text-orange-500" />
                <span className="text-orange-600 font-black text-sm">Starts in 1h 42m 30s</span>
              </div>
            </motion.div>

            {/* Real-time chat */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="bg-white border-2 border-orange-100 rounded-3xl p-8 shadow-xl shadow-orange-50/50 group cursor-default"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                <MessageCircle className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-tight mb-2">Squad Chat</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Every activity has a real-time chat room for participants. Coordinate meetup spots, share strategies, and hype each other up.</p>
              <div className="mt-5 space-y-2">
                {[
                  { name: 'Rahul', msg: 'Bringing extra bat', mine: false },
                  { name: 'You', msg: 'Perfect! See you there', mine: true },
                ].map(({ name, msg, mine }) => (
                  <div key={name} className={`flex gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full shrink-0 ${mine ? 'bg-orange-200' : 'bg-slate-200'}`} />
                    <div className={`text-xs px-3 py-1.5 rounded-xl font-medium max-w-[75%] ${mine ? 'bg-orange-500 text-white' : 'bg-orange-50 text-slate-700 border border-orange-100'}`}>{msg}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Smart waitlist */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 border-2 border-orange-100 shadow-xl shadow-orange-50/50 group cursor-default"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                <Users className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-tight mb-2">Smart Waitlist</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Activity full? Join the waitlist and get auto-promoted if someone leaves — with an instant notification.</p>
              <div className="mt-5 space-y-2">
                {['Arjun — #1 in line', 'Priya — #2 in line'].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-slate-700 text-xs font-semibold">{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Gaming profiles */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 border-2 border-orange-100 shadow-xl shadow-orange-50/50 group cursor-default"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                <Gamepad2 className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-tight mb-2">Gaming Profiles</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Save your in-game IDs and ranks per game. When you join a gaming activity, your IGN is autofilled — no typing, just play.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {[['BGMI', '#1 Conqueror'], ['VALORANT', 'Diamond 3']].map(([game, rank]) => (
                  <div key={game} className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
                    <div className="text-orange-800 text-[10px] font-semibold">{game}</div>
                    <div className="text-orange-900 font-black text-xs">{rank}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Borrow Equipment */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -6 }}
              className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-orange-500 to-orange-400 rounded-3xl p-8 group cursor-default text-white shadow-xl shadow-orange-500/20"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <HandHeart className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-black text-xl uppercase tracking-tight mb-2">Borrow & Lend</h3>
              <p className="text-white/90 text-sm leading-relaxed">Missing a bat or a controller? Ask the campus! Post an equipment request and a peer can accept it and tell you where to pick it up.</p>
              <div className="mt-5 bg-white/20 border border-white/10 rounded-xl p-3">
                <div className="text-white/80 text-[10px] font-semibold uppercase tracking-widest mb-1">Live Request</div>
                <div className="text-white font-black text-sm mb-1">Need a Cricket Bat</div>
                <div className="text-white/90 text-xs font-medium">Accepted by Rahul!</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORIES SHOWCASE
      ═══════════════════════════════════════════════════ */}
      <section className="bg-orange-50/50 py-24 border-t border-orange-100">
        <div className="w-[95%] max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-5">
              <Flame className="w-3.5 h-3.5" /> All Games
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-slate-900 uppercase tracking-tighter">
              Your Sport. <span className="text-orange-600">Your Game.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Sports</p>
                <div className="flex flex-wrap gap-2">
                  {SPORTS_CATEGORIES.map((c, i) => (
                    <motion.div key={c} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                      <Link
                        to={`/feed?category=${c}`}
                        onMouseEnter={() => setActiveCategory(c)}
                        className={`inline-flex items-center gap-1.5 border-2 text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 uppercase tracking-wide ${activeCategory === c ? 'bg-orange-500 border-orange-500 text-white shadow-orange-500/30 shadow-lg scale-105' : 'bg-white border-orange-200 text-slate-600 hover:bg-orange-50 hover:border-orange-300'}`}
                      >
                        {c}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Gaming</p>
                <div className="flex flex-wrap gap-2">
                  {GAMING_CATEGORIES.map((c, i) => (
                    <motion.div key={c} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                      <Link
                        to={`/feed?category=${c}`}
                        onMouseEnter={() => setActiveCategory(c)}
                        className={`inline-flex items-center gap-1.5 border-2 text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 uppercase tracking-wide ${activeCategory === c ? 'bg-orange-500 border-orange-500 text-white shadow-orange-500/30 shadow-lg scale-105' : 'bg-white border-orange-200 text-slate-600 hover:bg-orange-50 hover:border-orange-300'}`}
                      >
                        {c}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              className="sticky top-8 relative h-[380px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeCategory}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  src={SPORT_IMAGES[activeCategory] || SPORT_IMAGES['default']}
                  alt={activeCategory}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/90 via-orange-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                <div>
                  <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Trending Now
                  </div>
                  <div className="font-display font-black text-4xl text-white uppercase tracking-tighter">{activeCategory}</div>
                </div>
                <Link to={`/feed?category=${activeCategory}`} className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white hover:scale-110 hover:bg-orange-600 transition-all shadow-glow">
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════ */}
      <section className="bg-white py-28 relative overflow-hidden border-t border-orange-100">
        {/* BG glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-100/50 rounded-full blur-[100px]" />
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#f97316 1px,transparent 1px),linear-gradient(90deg,#f97316 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-8">
              <Flame className="w-3.5 h-3.5" /> Ready to Play?
            </div>
            <h2 className="font-display font-black text-5xl sm:text-7xl text-slate-900 uppercase tracking-tighter mb-6 leading-none">
              Your Squad<br /><span className="text-orange-500">Awaits.</span>
            </h2>
            <p className="text-slate-600 text-xl mb-12 max-w-xl mx-auto leading-relaxed">
              Join hundreds of students already using CrewUp to find teammates, schedule games, and just play.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/sign-up" id="cta-join-btn" className="btn-primary text-lg py-5 px-10 shadow-orange-500/20 shadow-lg hover:shadow-orange-500/40">
                    Join CrewUp Free <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <button
                    onClick={() => setLoginGate(true)}
                    className="inline-flex items-center gap-2 border-2 border-orange-200 text-slate-700 font-bold px-10 py-5 text-sm uppercase tracking-wider transition-all hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-sm"
                  >
                    <Play className="w-4 h-4" /> Browse Activities
                  </button>
                </motion.div>
              </SignedOut>
              <SignedIn>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/activities/create" className="btn-primary text-lg py-5 px-10 shadow-orange-500/20 shadow-lg hover:shadow-orange-500/40">
                    Create Activity <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </SignedIn>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-12 border-t border-orange-100">
              {[
                { icon: Shield, label: 'College Verified' },
                { icon: Zap, label: 'Free Forever' },
                { icon: Lock, label: 'Private Events' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                  <Icon className="w-4 h-4 text-orange-400" /> {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <LoginGate isOpen={loginGate} onClose={() => setLoginGate(false)} action="browse activities" />
    </div>
  );
};

export default LandingPage;
