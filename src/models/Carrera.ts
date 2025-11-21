import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface CarreraAttributes {
  id?: number;
  nombre: string;
  siglas: string;
  nivel: 'TSU' | 'Ingenieria' | 'Licenciatura';
  modalidad: 'Escolarizada' | 'Ejecutiva' | 'Mixta';
  duracion: string;
  objetivo: string;
  perfil_ingreso: string;
  perfil_egreso: string;
  campo_laboral: string;
  imagen: string;
  video_url?: string;
  plan_estudios_url?: string;
  orden: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Carrera extends Model<CarreraAttributes> implements CarreraAttributes {
  public id!: number;
  public nombre!: string;
  public siglas!: string;
  public nivel!: 'TSU' | 'Ingenieria' | 'Licenciatura';
  public modalidad!: 'Escolarizada' | 'Ejecutiva' | 'Mixta';
  public duracion!: string;
  public objetivo!: string;
  public perfil_ingreso!: string;
  public perfil_egreso!: string;
  public campo_laboral!: string;
  public imagen!: string;
  public video_url?: string;
  public plan_estudios_url?: string;
  public orden!: number;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Carrera.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    siglas: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nivel: {
      type: DataTypes.ENUM('TSU', 'Ingenieria', 'Licenciatura'),
      allowNull: false,
    },
    modalidad: {
      type: DataTypes.ENUM('Escolarizada', 'Ejecutiva', 'Mixta'),
      allowNull: false,
      defaultValue: 'Escolarizada',
    },
    duracion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    objetivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    perfil_ingreso: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    perfil_egreso: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    campo_laboral: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    video_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    plan_estudios_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'carreras',
    timestamps: true,
  }
);

export default Carrera;
