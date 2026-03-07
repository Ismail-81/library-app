// src/components/Logo.jsx
import { Link } from 'react-router-dom';

export const Logo = ({
  linkTo = '/',
  showTagline = false,
  className = '',
  textClassName = '',
  iconClassName = '',
  svgClassName = '',
}) => (
  <Link to={linkTo} className={`inline-flex items-center gap-2.5 group ${className}`}>
    <div
      className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
        iconClassName || 'bg-amber-400'
      }`}
    >
      <svg
        className={`w-5 h-5 ${svgClassName || 'text-ink-900'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
    <div className="flex flex-col leading-tight">
      <span
        className={`font-display text-xl font-bold ${
          textClassName || 'text-amber-100 group-hover:text-amber-300 transition-colors'
        }`}
      >
        Bookentra
      </span>
      {showTagline && (
        <span className="text-xs text-current/60">Digital Library System</span>
      )}
    </div>
  </Link>
);

export default Logo;
