export default function ListField({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-4">
      <h3 className="font-cinzel font-bold text-lg text-antique-gold">{label}</h3>
      <ul className="list-disc pl-5 font-eb-garamond font-medium text-ink-black">
        {items.map((item, i) => (
          <li key={i}>
            {typeof item === 'object'
              ? item.titulo ?? item.title ?? JSON.stringify(item)
              : item}
          </li>
        ))}
      </ul>
    </div>
  );
}