const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-3',
};

const Spinner = ({ size = 'md' }) => (
  <div
    className={`${sizes[size]} rounded-full border-slate-200 border-t-indigo-600 animate-spin`}
  />
);

export default Spinner;
