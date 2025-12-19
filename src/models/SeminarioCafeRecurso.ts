import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SeminarioCafeRecursoAttributes {
  id: number;
  titulo: string;
  descripcion?: string;
  url: string;
  tipo: 'pdf' | 'image';
  fecha_subida: Date;
  is_active: boolean;
}

interface SeminarioCafeRecursoCreationAttributes extends Optional<SeminarioCafeRecursoAttributes, 'id' | 'fecha_subida' | 'is_active' | 'descripcion'> {}

class SeminarioCafeRecurso extends Model<SeminarioCafeRecursoAttributes, SeminarioCafeRecursoCreationAttributes> implements SeminarioCafeRecursoAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion?: string;
  public url!: string;
  public tipo!: 'pdf' | 'image';
  public fecha_subida!: Date;
  public is_active!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SeminarioCafeRecurso.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('pdf', 'image'),
      allowNull: false,
    },
    fecha_subida: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    sequelize,
    modelName: 'SeminarioCafeRecurso',
    tableName: 'seminario_cafe_recursos',
    timestamps: true,
  }
);

export default SeminarioCafeRecurso;
