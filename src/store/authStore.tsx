import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthApiService, AuthUser } from '../services/authApiService';
import { StorageService } from '../services/storageService';

interface AuthState {
  user: AuthUser | null;
  isGuest: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  setGuest: (v: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isGuest: false,
  isLoading: true,
  setGuest: () => {},
  setUser: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from MMKV if token exists
    if (StorageService.isLoggedIn()) {
      setUserState({
        id:           StorageService.getUserId() ?? '',
        phone:        StorageService.getUserPhone() ?? '',
        display_name: '',
        membership:   (StorageService.getMembership() ?? 'free') as AuthUser['membership'],
        trial_used:   false,
        referral_code: '',
        created_at:   0,
      });
    }
    setIsLoading(false);
  }, []);

  const setUser = useCallback((u: AuthUser | null) => setUserState(u), []);

  const setGuest = useCallback((v: boolean) => setIsGuest(v), []);

  const signOut = useCallback(async () => {
    try {
      await AuthApiService.logout();
    } finally {
      setUserState(null);
      setIsGuest(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isGuest, isLoading, setGuest, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export type { AuthUser };
