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
        const prof = await getUserProfile(firebaseUser.uid);
        console.log('AuthContext profile:', prof); // Debug log
        console.log('AuthContext role:', prof?.role); // Debug log
        setProfile(prof);
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
