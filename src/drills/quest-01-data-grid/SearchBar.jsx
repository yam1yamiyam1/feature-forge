import "./styles.css";

const SearchBar = ({ value, onFilterChange }) => {
  return (
    <input
      className="dg-search"
      type="text"
      value={value}
      onChange={(e) => onFilterChange(e.target.value)}
    />
  );
};

export default SearchBar;
