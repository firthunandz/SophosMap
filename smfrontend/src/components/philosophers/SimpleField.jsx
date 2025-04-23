export default function SimpleField({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="mb-4">
      <h3 className="font-cinzel font-bold text-lg text-antique-gold">{label}</h3>
      <p className="text-ink-black font-eb-garamond font-medium">{value}</p>
    </div>
  );
}