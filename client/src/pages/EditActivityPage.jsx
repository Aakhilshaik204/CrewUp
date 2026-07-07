import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Save, Trash2 } from 'lucide-react';
import { getActivityById, updateActivity, cancelActivity } from '../api/activities';
import { SPORTS_CATEGORIES, GAMING_CATEGORIES } from '../utils/constants';
import Spinner from '../components/common/Spinner';
import BackButton from '../components/common/BackButton';

const EditActivityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    getActivityById(id)
      .then((res) => {
        const a = res.data.activity;
        setForm({
          title: a.title,
          category: a.category,
          activityType: a.activityType,
          description: a.description || '',
          date: a.date?.split('T')[0] || '',
          time: a.time,
          venue: a.venue,
          maxPlayers: a.maxPlayers,
          registrationOpen: a.registrationOpen,
        });
      })
      .catch(() => navigate('/feed'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateActivity(id, { ...form, maxPlayers: Number(form.maxPlayers) });
      toast.success('Activity updated');
      navigate(`/activities/${id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!form) return null;

  const categories = form.activityType === 'Sports' ? SPORTS_CATEGORIES : GAMING_CATEGORIES;

  return (
    <div className="page-container max-w-2xl">
      <BackButton fallbackPath={`/activities/${id}`} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl text-white mb-8">Edit Activity</h1>
        <form onSubmit={handleSave} className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 font-medium">Title</label>
            <input name="title" type="text" value={form.title} onChange={handleChange} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">Max Players</label>
              <input name="maxPlayers" type="number" value={form.maxPlayers} onChange={handleChange} min="2" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-medium">Time</label>
              <input name="time" type="time" value={form.time} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 font-medium">Venue</label>
            <input name="venue" type="text" value={form.venue} onChange={handleChange} className="input-field" />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="registrationOpen"
              name="registrationOpen"
              checked={form.registrationOpen}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-primary-500"
            />
            <label htmlFor="registrationOpen" className="text-sm text-gray-300">Registration Open</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditActivityPage;
