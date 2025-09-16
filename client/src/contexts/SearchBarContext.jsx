import React, { createContext, useContext, useState } from "react";

const SearchBarContext = createContext();

export const SearchBarProvider = ({ children }) => {
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  return (
    <SearchBarContext.Provider value={{ searchBarOpen, setSearchBarOpen }}>
      {children}
    </SearchBarContext.Provider>
  );
};

export const useSearchBar = () => useContext(SearchBarContext);