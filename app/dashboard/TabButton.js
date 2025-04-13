const TabButton = ({ isActive, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    role="tab"
    aria-selected={isActive}
    aria-label={`Tab for ${label}`}
    className={`px-4 py-2 rounded-md transition-colors duration-200 ${
      isActive
        ? "bg-rose-600 text-white font-semibold shadow-md"
        : "bg-rose-200 text-gray-700 hover:bg-rose-300 hover:text-gray-900"
    }`}
  >
    {label}
  </button>
);

export default TabButton;
