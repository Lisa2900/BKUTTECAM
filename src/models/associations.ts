import Area from './Area';
import Categorias from './Categorias';
import Archivos from './Archivos';
import PortalEstudiantes from './PortalEstudiantes';
import ExtensionSection from './ExtensionSection';
import ExtensionItem from './ExtensionItem';

// Definir las relaciones entre modelos

// AREA ──→ CATEGORIAS (One-to-Many)
// Un área puede tener muchas categorías
Area.hasMany(Categorias, {
  foreignKey: 'ID_Area',
  as: 'categorias',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT' // No permitir eliminar áreas que tengan categorías
});

// Una categoría pertenece a un área
Categorias.belongsTo(Area, {
  foreignKey: 'ID_Area',
  as: 'area',
  onUpdate: 'CASCADE'
});

// CATEGORIAS ──→ ARCHIVOS (One-to-Many)
// Una categoría puede tener muchos archivos
Categorias.hasMany(Archivos, {
  foreignKey: 'ID_Categorias',
  as: 'archivos',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT' // No permitir eliminar categorías que tengan archivos
});

// Un archivo pertenece a una categoría
Archivos.belongsTo(Categorias, {
  foreignKey: 'ID_Categorias',
  as: 'categoria',
  onUpdate: 'CASCADE'
});

// ExtensionSection ──→ ExtensionItem (One-to-Many)
ExtensionSection.hasMany(ExtensionItem, {
  foreignKey: 'section_id',
  as: 'items',
  onDelete: 'CASCADE'
});

ExtensionItem.belongsTo(ExtensionSection, {
  foreignKey: 'section_id',
  as: 'section'
});

// Exportar todos los modelos con sus relaciones configuradas
export { Area, Categorias, Archivos, PortalEstudiantes, ExtensionSection, ExtensionItem };

// También exportar individualmente para facilitar importaciones
export default { Area, Categorias, Archivos, PortalEstudiantes, ExtensionSection, ExtensionItem };
