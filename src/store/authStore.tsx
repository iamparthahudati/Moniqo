import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { configureGoogleSignIn } from '../services/authService';

type AuthUser = FirebaseAuthTypes.User | null;
type GuestMode = boolean;

interface AuthState {
  user: AuthUser;
  isGuest: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  setGuest: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isGuest: false,
  isLoading: true,
  setGuest: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps): React.JSX.Element {
  const [user, setUser] = useState<AuthUser>(null);
  const [isGuest, setIsGuest] = useState<GuestMode>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser: AuthUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const setGuest = useCallback((v: boolean) => {
    setIsGuest(v);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isGuest, isLoading, setGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
