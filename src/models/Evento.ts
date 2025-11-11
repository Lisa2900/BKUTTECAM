import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface EventoAttributes {
  id?: number;
  titulo: string;
  descripcion?: string;
  fecha_evento: Date;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

class Evento extends Model<EventoAttributes> implements EventoAttributes {
  public id!: number;
  public titulo!: string;
  public descripcion?: string;
  public fecha_evento!: Date;
  public activo!: boolean;
  public fecha_creacion!: Date;
  public fecha_actualizacion!: Date;
}

Evento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_evento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'eventos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default Evento;
