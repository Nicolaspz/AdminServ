const ToggleSwitch = ({ 
  isOn, 
  onToggle,
  size = 'md'
}: {
  isOn: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizes = {
    sm: {
      container: 'w-10 h-5',
      knob: 'w-4 h-4'
    },
    md: {
      container: 'w-12 h-6',
      knob: 'w-5 h-5'
    },
    lg: {
      container: 'w-14 h-7',
      knob: 'w-6 h-6'
    }
  };

  return (
    <button
      type="button"
      className={`${sizes[size].container} flex items-center rounded-full p-0.5 cursor-pointer transition-colors focus:outline-none ${
        isOn ? 'bg-green-500 justify-end' : 'bg-gray-600 justify-start'
      }`}
      onClick={onToggle}
    >
      <div className={`${sizes[size].knob} bg-white rounded-full shadow-md transform transition-transform`} />
    </button>
  );
};