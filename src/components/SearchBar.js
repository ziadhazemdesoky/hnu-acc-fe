import React from "react";

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded text-right"
      />
    </div>
  );
};

export default SearchBar;
