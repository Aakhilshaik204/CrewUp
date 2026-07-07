import { Link } from 'react-router-dom';
import { Twitter, Instagram, Github, Mail, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-950 pt-20 pb-10 border-t-4 border-orange-500 overflow-hidden relative">
    {/* Background elements */}
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

    <div className="w-[95%] max-w-[1600px] mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
        
        {/* Brand Column */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col items-start">
          <Link to="/" className="inline-block mb-6 hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-2">
              <img src="/logo.jpeg" alt="CrewUp Logo" className="h-16 w-auto object-contain scale-[1.8] origin-left mix-blend-screen invert hue-rotate-180 opacity-100" />
            </div>
          </Link>
          <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
            The ultimate campus platform for finding teammates, hosting matches, and borrowing equipment. Built for college students, by college students.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links Columns */}
        <div className="md:col-span-4 lg:col-span-2">
          <h4 className="text-white font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> Platform
          </h4>
          <ul className="space-y-4">
            <li><Link to="/feed" className="text-slate-400 hover:text-orange-400 transition-colors font-medium">Explore Feed</Link></li>
            <li><Link to="/activities/create" className="text-slate-400 hover:text-orange-400 transition-colors font-medium">Create Activity</Link></li>
            <li><Link to="/requests" className="text-slate-400 hover:text-orange-400 transition-colors font-medium">Borrow Equipment</Link></li>
            <li><Link to="/dashboard" className="text-slate-400 hover:text-orange-400 transition-colors font-medium">My Dashboard</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4 lg:col-span-2">
          <h4 className="text-white font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" /> Company
          </h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">About Us</a></li>
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Careers</a></li>
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Privacy Policy</a></li>
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="md:col-span-4 lg:col-span-3">
          <h4 className="text-white font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Contact
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
              <span className="text-slate-400 font-medium">hello@crewup.app</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
              <span className="text-slate-400 font-medium leading-relaxed">123 University Ave<br />Campus Hub, CA 90210</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} CrewUp. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          Built with <span className="text-red-500">♥</span> for college students
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
