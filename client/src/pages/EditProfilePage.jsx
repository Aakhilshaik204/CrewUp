import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Gamepad2 } from 'lucide-react';
import { getMe, updateMe } from '../api/users';
import { SPORTS_CATEGORIES, GAMING_CATEGORIES, YEAR_OPTIONS } from '../utils/constants';
import Spinner from '../components/common/Spinner';
import BackButton from '../components/common/BackButton';

const InterestToggle = ({ label, selected, onToggle }) => (
  <button
    type="button"
    onClick={() => onToggle(label)}
    className={`px-3 py-1.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
      selected
        ? 'bg-primary-600 text-white shadow-glow-sm'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    {label}
  </button>
);

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ branch: '', year: '', interests: { sports: [], gaming: [] }, gamingProfiles: [] });

  useEffect(() => {
    getMe()
      .then((res) => {
        const u = res.data.user;
        setForm({
          branch: u.branch || '',
          year: u.year || '',
          interests: {
            sports: u.interests?.sports || [],
            gaming: u.interests?.gaming || [],
          },
          gamingProfiles: u.gamingProfiles || [],
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const toggleInterest = (type, item) => {
    setForm((prev) => {
      const current = prev.interests[type];
      const updated = current.includes(item) ? current.filter((i) => i !== item) : [...current, item];
      return { ...prev, interests: { ...prev.interests, [type]: updated } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate gaming profiles
    const invalidProfile = form.gamingProfiles.find(p => !p.game || !p.inGameId.trim());
    if (invalidProfile) {
      toast.error('Please complete all added gaming profiles (Game and IGN are required)');
      return;
    }

    try {
      setSaving(true);
      await updateMe(form);
      toast.success('Profile updated! ✨');
      navigate(-1);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-container max-w-2xl mx-auto">
      <BackButton />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8">
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">Edit Profile</h1>
        <p className="text-slate-500 text-sm mb-8">Update your branch, year, and interests</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-xl text-slate-900">Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Branch</label>
                <input
                  id="edit-branch"
                  type="text"
                  value={form.branch}
                  onChange={(e) => setForm((prev) => ({ ...prev, branch: e.target.value }))}
                  placeholder="e.g. CSE, ECE, Mechanical"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Year</label>
                <select
                  id="edit-year"
                  value={form.year}
                  onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Sports Interests */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-xl text-slate-900 mb-1">Sports Interests</h2>
            <p className="text-sm text-slate-500 mb-4">Select sports you enjoy playing</p>
            <div className="flex flex-wrap gap-2">
              {SPORTS_CATEGORIES.map((s) => (
                <InterestToggle
                  key={s}
                  label={s}
                  selected={form.interests.sports.includes(s)}
                  onToggle={(item) => toggleInterest('sports', item)}
                />
              ))}
            </div>
          </div>

          {/* Gaming Interests */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-xl text-slate-900 mb-1">Gaming Interests</h2>
            <p className="text-sm text-slate-500 mb-4">Select games you play</p>
            <div className="flex flex-wrap gap-2">
              {GAMING_CATEGORIES.map((g) => (
                <InterestToggle
                  key={g}
                  label={g}
                  selected={form.interests.gaming.includes(g)}
                  onToggle={(item) => toggleInterest('gaming', item)}
                />
              ))}
            </div>
          </div>

          {/* Gaming Roster */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="w-5 h-5 text-primary-500" />
              <h2 className="font-display font-bold text-xl text-slate-900">Gaming Roster</h2>
            </div>
            <p className="text-sm text-slate-500">Save your In-Game IDs for quick autofill when joining lobbies.</p>

            {form.gamingProfiles.map((profile, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, gamingProfiles: prev.gamingProfiles.filter((_, i) => i !== idx) }))}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Game *</label>
                    <select
                      value={profile.game}
                      onChange={(e) => {
                        const newProfiles = [...form.gamingProfiles];
                        newProfiles[idx].game = e.target.value;
                        setForm({ ...form, gamingProfiles: newProfiles });
                      }}
                      className="input-field py-2 text-sm"
                      required
                    >
                      <option value="">Select Game</option>
                      {GAMING_CATEGORIES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">In-Game Name *</label>
                    <input
                      type="text"
                      value={profile.inGameId}
                      onChange={(e) => {
                        const newProfiles = [...form.gamingProfiles];
                        newProfiles[idx].inGameId = e.target.value;
                        setForm({ ...form, gamingProfiles: newProfiles });
                      }}
                      required
                      placeholder="e.g. PlayerOne"
                      className="input-field py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">In-Game ID</label>
                    <input
                      type="text"
                      value={profile.inGameCode}
                      onChange={(e) => {
                        const newProfiles = [...form.gamingProfiles];
                        newProfiles[idx].inGameCode = e.target.value;
                        setForm({ ...form, gamingProfiles: newProfiles });
                      }}
                      placeholder="e.g. 5123456789"
                      className="input-field py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Rank (Optional)</label>
                    <input
                      type="text"
                      value={profile.rank}
                      onChange={(e) => {
                        const newProfiles = [...form.gamingProfiles];
                        newProfiles[idx].rank = e.target.value;
                        setForm({ ...form, gamingProfiles: newProfiles });
                      }}
                      placeholder="Diamond"
                      className="input-field py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, gamingProfiles: [...prev.gamingProfiles, { game: '', inGameId: '', rank: '' }] }))}
              className="w-full border-2 border-dashed border-primary-200 text-primary-600 rounded-xl py-3 flex items-center justify-center gap-2 font-bold hover:bg-primary-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add Gaming Profile
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 shadow-glow"
            id="edit-profile-save-btn"
          >
            {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfilePage;
