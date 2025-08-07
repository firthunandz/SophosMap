import ModalPhoto from './ModalPhoto';
import SimpleField from './SimpleField';
import ListField from './ListField';
import WorksField from './WorksField';

const ModalContent = ({ philosopher }) => {
  return (
    <div className="pt-4 pb-2 px-6 sm:px-10 grid md:grid-cols-2 sm:gap-x-16">
      <div>
        <ModalPhoto philosopher={philosopher} />
        <SimpleField label="Nombre completo" value={philosopher.nombre} />
        <SimpleField label="Fecha de nacimiento" value={philosopher.fecha_nacimiento} />
        <SimpleField label="Lugar de nacimiento" value={philosopher.lugar_nacimiento} />
        <SimpleField label="Fecha de fallecimiento" value={philosopher.fecha_muerte} />
        <SimpleField label="Lugar de fallecimiento" value={philosopher.lugar_muerte} />
        <SimpleField label="Época" value={philosopher.era} />
        <SimpleField label="Escuela filosófica" value={philosopher.escuela} />
        <SimpleField label="Religión" value={philosopher.religion} />
        <SimpleField label="Notas" value={philosopher.notas} />
      </div>

      <div>
        <ListField label="Legado" items={philosopher.legado} />
        <ListField label="Ocupación" items={philosopher.ocupacion} />
        <ListField label="Intereses" items={philosopher.intereses} />
        <ListField label="Conceptos principales" items={philosopher.conceptos} />
        <ListField label="Influencias" items={philosopher.influencias} />
        <ListField label="Estudiantes" items={philosopher.estudiantes} />
        <ListField label="Maestros" items={philosopher.maestros} />
      </div>

      <div className="md:col-span-2">
        <ListField label="Citas famosas" items={philosopher.quotes} />
        <WorksField label="Libros" obras={philosopher.books} />
        <WorksField label="Obras destacadas" obras={philosopher.works} />
      </div>
    </div>
  );
}

export default ModalContent;