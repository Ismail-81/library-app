// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthChanges, getUserProfile } from '../firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const prof = await getUserProfile(firebaseUser.uid);
          console.log('[AuthContext] Fetched profile:', prof);
          console.log('[AuthContext] User role:', prof?.role);
          
          if (prof && prof.role) {
            // Profile exists with a valid role
            console.log('[AuthContext] Setting profile with role:', prof.role);
            setProfile(prof);
          } else if (prof) {
            // Profile exists but no role - assign default
            console.warn('[AuthContext] Profile exists but missing role, defaulting to student');
            setProfile({ ...prof, role: 'student' });
          } else {
            // Document doesn't exist - create minimal profile with student role
            console.warn('[AuthContext] No profile document found, creating default student profile');
            setProfile({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'student' });
          }
        } catch (error) {
          console.error('[AuthContext] Error fetching profile:', error);
          // Fallback to minimal profile
          setProfile({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'student' });
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const prof = await getUserProfile(user.uid);
      setProfile(prof);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
