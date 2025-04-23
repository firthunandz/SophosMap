export default function WorksField({ label, obras }) {
  if (!obras || obras.length === 0) return null;
  return (
    <div className="mb-4">
      <h3 className="font-cinzel font-bold text-lg text-antique-gold">{label}</h3>
      <ul className="list-disc pl-5 font-eb-garamond font-medium text-ink-black">
        {obras.map((obra, i) => (
          <li key={i}>
            <strong>{obra.titulo}</strong>
            {obra.descripcion && ` – ${obra.descripcion}`}
          </li>
        ))}
      </ul>
    </div>
  );
}