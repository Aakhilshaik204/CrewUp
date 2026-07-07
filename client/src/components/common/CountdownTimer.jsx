import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const CountdownTimer = ({ date, time, status, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isStarted, setIsStarted] = useState(status === 'Ongoing');

  useEffect(() => {
    if (!date || !time) return;

    // Combine date and time to create target Date object
    const targetDate = new Date(date);
    const [hours, minutes] = time.split(':');
    targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (status === 'Ongoing') {
        setIsStarted(true);
        setTimeLeft('Activity has started!');
        return;
      }

      if (diff <= 0) {
        setIsStarted(true);
        setTimeLeft('Activity has started!');
        if (onExpire) onExpire();
        return;
      }

      setIsStarted(false);
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`Starts in ${h}h ${m}m ${s}s`);
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [date, time, status]);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 shadow-sm ${
      isStarted 
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
        : 'bg-orange-50 text-orange-600 border-orange-100'
    }`}>
      <Timer className="w-4 h-4" />
      {timeLeft}
    </div>
  );
};

export default CountdownTimer;
