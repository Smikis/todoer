import React, {createContext, useState} from 'react';

const SideBarContext = createContext(
  {} as {
    sideBarOpen: boolean;
    setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  },
);

export function SideBarProvider({children}: {children: React.ReactNode}) {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <SideBarContext.Provider
      value={{
        sideBarOpen,
        setSideBarOpen,
      }}>
      {children}
    </SideBarContext.Provider>
  );
}

export default SideBarContext;
