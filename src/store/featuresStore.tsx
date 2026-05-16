import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AppFeatures, DEFAULT_FEATURES, FeaturesApiService } from '../services/featuresApiService';

interface FeaturesContextValue {
  features: AppFeatures;
  isLoaded: boolean;
}

const FeaturesContext = createContext<FeaturesContextValue>({
  features: DEFAULT_FEATURES,
  isLoaded: false,
});

export function FeaturesProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [features, setFeatures] = useState<AppFeatures>(DEFAULT_FEATURES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    FeaturesApiService.getFeatures()
      .then(setFeatures)
      .finally(() => setIsLoaded(true));
  }, []);

  return (
    <FeaturesContext.Provider value={{ features, isLoaded }}>
      {children}
    </FeaturesContext.Provider>
  );
}

export function useFeatures(): FeaturesContextValue {
  return useContext(FeaturesContext);
}

// Convenience hooks
export function useAuthFeatures() {
  return useFeatures().features.auth;
}
