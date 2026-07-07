import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HandHeart, Gamepad2, Dumbbell, AlertCircle, Calendar } from 'lucide-react';
import { createRequest } from '../api/requests';
import Spinner from '../components/common/Spinner';
import BackButton from '../components/common/BackButton';

const CreateRequestPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Sports',
    neededBy: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.neededBy) {
      return toast.error('Please fill in all fields');
    }

    try {
      setLoading(true);
      const res = await createRequest(form);
      toast.success('Request posted! 🎉');
      navigate(`/requests/${res.data.request._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to post request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20 pt-8">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6"><BackButton /></div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-sm border border-slate-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <HandHeart className="w-8 h-8" />
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 uppercase tracking-tighter mb-2">Ask for Equipment</h1>
            <p className="text-slate-500 font-medium">Post what you need and see if the campus can help you out!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Category *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Sports', icon: Dumbbell },
                  { id: 'Gaming', icon: Gamepad2 },
                  { id: 'Other', icon: AlertCircle }
                ].map(c => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, category: c.id }))}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        form.category === c.id 
                          ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">{c.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">What do you need? *</label>
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Need a Cricket Bat for 2 hours"
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:border-orange-500 font-bold text-lg"
                maxLength={100}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Details *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Playing at the main ground at 5pm. Will return it by 7pm!"
                rows="4"
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:border-orange-500 font-medium resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange-500" /> Needed By *</label>
              <input
                name="neededBy"
                type="datetime-local"
                value={form.neededBy}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-sm shadow-glow flex justify-center"
              >
                {loading ? <Spinner size="sm" /> : 'Post Request'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRequestPage;
