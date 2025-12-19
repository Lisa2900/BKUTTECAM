import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PracticasEstadiasBannerAttributes {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

interface PracticasEstadiasBannerCreationAttributes extends Optional<PracticasEstadiasBannerAttributes, 'id' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

class PracticasEstadiasBanner extends Model<PracticasEstadiasBannerAttributes, PracticasEstadiasBannerCreationAttributes> implements PracticasEstadiasBannerAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public imagen!: string;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

PracticasEstadiasBanner.init({
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
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'practicas_estadias_banner',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
});

export default PracticasEstadiasBanner;
