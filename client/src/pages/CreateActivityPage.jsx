import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Users, FileText, CheckCircle2, Lock, Globe, ChevronRight, ChevronLeft, Gamepad2, Sparkles, AlertCircle } from 'lucide-react';
import { createActivity } from '../api/activities';
import { getMe } from '../api/users';
import { SPORTS_CATEGORIES, GAMING_CATEGORIES } from '../utils/constants';
import { SPORT_IMAGES } from '../utils/sportImages';
import Spinner from '../components/common/Spinner';
import { useUser } from '@clerk/clerk-react';
import ActivityCard from '../components/activity/ActivityCard';
import BackButton from '../components/common/BackButton';

const CategoryImageCard = ({ name, selected, onClick, image }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -4, scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className={`relative overflow-hidden rounded-2xl h-28 sm:h-32 flex-shrink-0 w-full border-2 transition-all duration-200 shadow-sm ${
      selected
        ? 'border-orange-500 shadow-[0_4px_15px_rgba(249,115,22,0.3)]'
        : 'border-transparent hover:border-slate-300'
    }`}
  >
    <img
      src={image || SPORT_IMAGES.default}
      alt={name}
      className="w-full h-full object-cover"
    />
    <div className={`absolute inset-0 transition-all duration-200 ${selected ? 'bg-orange-900/40' : 'bg-slate-900/60 hover:bg-slate-900/40'}`} />

    {/* Selected tick */}
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-2 right-2 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-md border-2 border-white"
      >
        <CheckCircle2 className="w-4 h-4 text-white" />
      </motion.div>
    )}

    <div className="absolute inset-0 p-3 flex items-center justify-center text-center">
      <span className="text-white font-display font-black text-xl sm:text-2xl uppercase tracking-widest drop-shadow-md">{name}</span>
    </div>
  </motion.button>
);

const CreateActivityPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [mongoUser, setMongoUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (user) {
      getMe().then(res => setMongoUser(res.data.user)).catch(() => {});
    }
  }, [user]);

  const [form, setForm] = useState({
    title: '',
    category: '',
    activityType: 'Sports',
    description: '',
    date: '',
    time: '',
    venue: '',
    maxPlayers: '',
    minRank: '',
    hostInGameId: '',
    hostRank: '',
    visibility: 'Public',
  });
  const [customCategory, setCustomCategory] = useState('');

  const categories = form.activityType === 'Sports' ? SPORTS_CATEGORIES : GAMING_CATEGORIES;
  const finalCategory = form.category === 'Other' ? customCategory.trim() : form.category;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'activityType' ? { category: '' } : {}),
    }));
    if (name === 'activityType') setCustomCategory('');
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!finalCategory) {
        toast.error('Please select a category');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!form.title.trim()) { toast.error('Title is required'); return false; }
      if (!form.date) { toast.error('Date is required'); return false; }
      if (!form.time) { toast.error('Time is required'); return false; }
      if (!form.venue.trim()) { toast.error('Venue is required'); return false; }
      return true;
    }
    if (step === 3) {
      if (!form.maxPlayers || Number(form.maxPlayers) < 2) { toast.error('Minimum 2 players required'); return false; }
      if (form.activityType === 'Gaming' && !form.hostInGameId.trim()) {
        toast.error('Your In-Game ID is required for Gaming activities');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    try {
      setLoading(true);
      const res = await createActivity({ ...form, category: finalCategory, maxPlayers: Number(form.maxPlayers) });
      toast.success('Activity created! 🎉');
      navigate(`/activities/${res.data.activity._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Category', icon: Sparkles },
    { id: 2, title: 'Details', icon: FileText },
    { id: 3, title: 'Requirements', icon: Users },
    { id: 4, title: 'Review', icon: CheckCircle2 }
  ];

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20 pt-8">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6"><BackButton /></div>

        {/* Header & Stepper */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-sm border border-slate-100 mb-8">
          <div className="text-center mb-10">
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 uppercase tracking-tighter mb-2">Create Activity</h1>
            <p className="text-slate-500 font-medium">Set up a sports or gaming activity for your crew</p>
          </div>

          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-500 rounded-full transition-all duration-500" 
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest absolute -bottom-6 whitespace-nowrap transition-colors ${isCurrent ? 'text-orange-500' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-sm border border-slate-100"
            >
              
              {/* STEP 1: CATEGORY */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <label className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-4 text-center">Activity Type</label>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      {['Sports', 'Gaming'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, activityType: t, category: '' }))}
                          className={`py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 border-2 ${
                            form.activityType === t
                              ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-4">
                      Select {form.activityType} Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                      {categories.map((cat) => (
                        <CategoryImageCard
                          key={cat}
                          name={cat}
                          image={SPORT_IMAGES[cat] || SPORT_IMAGES.default}
                          selected={form.category === cat}
                          onClick={() => {
                            let updates = { category: cat };
                            if (form.activityType === 'Gaming' && mongoUser?.gamingProfiles) {
                              const profile = mongoUser.gamingProfiles.find(p => p.game === cat);
                              if (profile) {
                                updates.hostInGameId = profile.inGameId;
                                updates.hostRank = profile.rank || '';
                                toast.success(`Autofilled IGN for ${cat}!`, { icon: '🎮' });
                              }
                            }
                            setForm((prev) => ({ ...prev, ...updates }));
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {form.category === 'Other' && (
                    <div className="pt-4 border-t border-slate-100 max-w-xl mx-auto">
                      <label className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-3">Custom Game Name *</label>
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Table Tennis..."
                        className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all font-medium placeholder:text-slate-400"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: CORE DETAILS */}
              {currentStep === 2 && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Activity Title *</label>
                    <input
                      name="title"
                      type="text"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Cricket Match at Main Ground"
                      className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all font-bold text-lg"
                      maxLength={100}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange-500" /> Date *</label>
                      <input
                        name="date"
                        type="date"
                        value={form.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5"><Clock className="w-4 h-4 text-orange-500" /> Time *</label>
                      <input
                        name="time"
                        type="time"
                        value={form.time}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-orange-500" /> Venue *</label>
                    <input
                      name="venue"
                      type="text"
                      value={form.venue}
                      onChange={handleChange}
                      placeholder={form.activityType === 'Sports' ? 'e.g. College Ground' : 'e.g. Discord Server / Lobby'}
                      className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Description (Optional)</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Add any extra details, rules, or what to bring..."
                      rows="3"
                      className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 font-medium resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: REQUIREMENTS */}
              {currentStep === 3 && (
                <div className="max-w-2xl mx-auto space-y-8">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5"><Users className="w-4 h-4 text-orange-500" /> Max Players *</label>
                    <input
                      name="maxPlayers"
                      type="number"
                      min="2"
                      max="100"
                      value={form.maxPlayers}
                      onChange={handleChange}
                      placeholder="e.g. 10"
                      className="w-full max-w-[200px] bg-white border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 font-black text-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Event Visibility *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'Public', icon: Globe, label: 'Public', desc: 'Visible on feed' },
                        { id: 'Private', icon: Lock, label: 'Private', desc: 'Code required' }
                      ].map((v) => {
                        const Icon = v.icon;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, visibility: v.id }))}
                            className={`p-4 rounded-xl text-left transition-all duration-200 border-2 flex items-center gap-4 ${
                              form.visibility === v.id
                                ? 'bg-orange-50 border-orange-500 shadow-sm'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`p-3 rounded-xl ${form.visibility === v.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className={`font-bold uppercase tracking-wider ${form.visibility === v.id ? 'text-orange-700' : 'text-slate-700'}`}>{v.label}</div>
                              <div className={`text-xs font-medium ${form.visibility === v.id ? 'text-orange-600/80' : 'text-slate-500'}`}>{v.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {form.activityType === 'Gaming' && (
                    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl text-white">
                      <h3 className="font-display font-bold text-xl flex items-center gap-2 mb-2"><Gamepad2 className="w-6 h-6 text-orange-500" /> Gaming Setup</h3>
                      <p className="text-slate-400 text-sm mb-6">Players will be required to provide their IGN when joining this activity.</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Your In-Game ID / IGN *</label>
                          <input
                            type="text"
                            name="hostInGameId"
                            value={form.hostInGameId}
                            onChange={handleChange}
                            placeholder="e.g. PlayerOne#1234"
                            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Your Rank (Optional)</label>
                          <input
                            type="text"
                            name="hostRank"
                            value={form.hostRank}
                            onChange={handleChange}
                            placeholder="e.g. Diamond 2"
                            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Minimum Rank Required (Optional)</label>
                          <input
                            type="text"
                            name="minRank"
                            value={form.minRank}
                            onChange={handleChange}
                            placeholder="e.g. Gold 1"
                            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: REVIEW & PREVIEW */}
              {currentStep === 4 && (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="font-display font-black text-2xl text-slate-900 uppercase tracking-tighter">Ready to Publish!</h2>
                    <p className="text-slate-500 font-medium">Here is how your activity card will look on the feed.</p>
                  </div>
                  
                  <div className="flex justify-center max-w-sm mx-auto">
                    <div className="w-full pointer-events-none scale-105 origin-top">
                      <ActivityCard 
                        activity={{
                          ...form,
                          category: finalCategory,
                          host: mongoUser || { name: 'You' },
                          currentPlayers: 1,
                          status: 'Open'
                        }} 
                        index={0}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 max-w-[1000px] mx-auto">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-colors border-2 border-transparent hover:border-slate-200"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-orange-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-500/30 text-lg"
            >
              {loading ? <Spinner size="sm" /> : <Sparkles className="w-6 h-6" />}
              Publish Activity
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreateActivityPage;
