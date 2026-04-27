import Area from './Area';
import Categorias from './Categorias';
import Archivos from './Archivos';
import PortalEstudiantes from './PortalEstudiantes';
import ExtensionSection from './ExtensionSection';
import ExtensionItem from './ExtensionItem';
import Comite from './Comite';
import ComiteCategory from './ComiteCategory';
import DocumentoComite from './DocumentoComite';

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

import NormatividadCategory from './NormatividadCategory';
import NormatividadDocument from './NormatividadDocument';
import ProgramaDesarrolloCategory from './ProgramaDesarrolloCategory';
import ProgramaDesarrollo from './ProgramaDesarrollo';

// Normatividad relations
NormatividadCategory.hasMany(NormatividadDocument, {
  foreignKey: 'categoria_id',
  as: 'documentos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

NormatividadDocument.belongsTo(NormatividadCategory, {
  foreignKey: 'categoria_id',
  as: 'categoria',
  onUpdate: 'CASCADE',
});

// ProgramaDesarrollo relations
ProgramaDesarrolloCategory.hasMany(ProgramaDesarrollo, {
  foreignKey: 'categoria_id',
  as: 'programas',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

ProgramaDesarrollo.belongsTo(ProgramaDesarrolloCategory, {
  foreignKey: 'categoria_id',
  as: 'categoria',
  onUpdate: 'CASCADE',
});

// COMITES relations
Comite.hasMany(ComiteCategory, {
  foreignKey: 'comiteId',
  as: 'categorias',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

ComiteCategory.belongsTo(Comite, {
  foreignKey: 'comiteId',
  as: 'comite'
});

ComiteCategory.hasMany(DocumentoComite, {
  foreignKey: 'categoriaId',
  as: 'documentos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

DocumentoComite.belongsTo(ComiteCategory, {
  foreignKey: 'categoriaId',
  as: 'categoria'
});

// Exportar todos los modelos con sus relaciones configuradas
export { 
  Area, 
  Categorias, 
  Archivos, 
  PortalEstudiantes, 
  ExtensionSection, 
  ExtensionItem, 
  NormatividadCategory, 
  NormatividadDocument,
  ProgramaDesarrolloCategory,
  ProgramaDesarrollo,
  Comite,
  ComiteCategory,
  DocumentoComite
};

// También exportar individualmente para facilitar importaciones
export default { 
  Area, 
  Categorias, 
  Archivos, 
  PortalEstudiantes, 
  ExtensionSection, 
  ExtensionItem, 
  NormatividadCategory, 
  NormatividadDocument,
  ProgramaDesarrolloCategory,
  ProgramaDesarrollo,
  Comite,
  ComiteCategory,
  DocumentoComite
};
