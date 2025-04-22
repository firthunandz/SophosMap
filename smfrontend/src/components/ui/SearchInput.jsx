const SearchInput = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "Buscar...",
  className = "",
  ...props
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`flex-grow rounded border border-warm-gray bg-ivory text-ink-black placeholder-warm-gray px-3 py-2 focus:outline-none focus:ring-2 focus:ring-antique-gold ${className}`}
      {...props}
    />
  );
};

export default SearchInput;
