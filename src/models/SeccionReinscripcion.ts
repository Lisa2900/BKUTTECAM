import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class SeccionReinscripcion extends Model {
  public id!: string;
  public titulo!: string;
  public subtitulo!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SeccionReinscripcion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    subtitulo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'seccion_reinscripcion',
    timestamps: true,
  }
);
