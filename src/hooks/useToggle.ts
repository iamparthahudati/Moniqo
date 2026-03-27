import { useState } from 'react';

export function useToggle(
  initialValue: boolean = false,
): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = (): void => {
    setValue(v => !v);
  };

  return [value, toggle];
}
