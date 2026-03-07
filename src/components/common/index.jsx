// src/components/common/LoadingSpinner.jsx
export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-2 border-ink-200 border-t-amber-500 rounded-full animate-spin`} />
      {text && <p className="text-sm text-ink-500 font-body">{text}</p>}
    </div>
  );
};

// src/components/common/PageLoader.jsx
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-ink-50">
    <div className="text-center animate-fade-in">
      <div className="w-12 h-12 border-2 border-ink-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="font-display text-ink-600 text-lg">Bibliotheca</p>
      <p className="text-xs text-ink-400 mt-1">Loading...</p>
    </div>
  </div>
);

// src/components/common/Modal.jsx
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-elevated animate-slide-up overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// src/components/common/SearchBar.jsx
export const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative ${className}`}>
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field pl-9"
    />
  </div>
);

// src/components/common/EmptyState.jsx
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="w-16 h-16 bg-ink-100 rounded-2xl flex items-center justify-center mb-4 text-ink-400">
      {icon}
    </div>
    <h3 className="font-display text-lg font-semibold text-ink-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-ink-500 max-w-xs mb-4">{description}</p>}
    {action}
  </div>
);

// src/components/common/ConfirmDialog.jsx
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-elevated p-6 max-w-sm w-full animate-slide-up">
        <h3 className="font-display text-lg font-semibold text-ink-900 mb-2">{title}</h3>
        <p className="text-sm text-ink-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-ghost text-sm">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// src/components/common/StatCard.jsx
export const StatCard = ({ icon, label, value, color = 'amber', trend }) => {
  const colors = {
    amber: 'bg-amber-100 text-amber-700',
    forest: 'bg-forest-100 text-forest-700',
    crimson: 'bg-crimson-100 text-crimson-700',
    ink: 'bg-ink-100 text-ink-700',
  };
  return (
    <div className="stat-card animate-slide-up">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink-500 font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
        {trend && <p className="text-xs text-ink-400 mt-0.5">{trend}</p>}
      </div>
    </div>
  );
};
