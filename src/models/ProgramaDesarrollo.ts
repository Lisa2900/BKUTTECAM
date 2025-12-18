
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProgramaDesarrolloAttributes {
    id: number;
    titulo: string;
    descripcion: string;
    archivo: string;
    activo: boolean;
}

interface ProgramaDesarrolloCreationAttributes extends Optional<ProgramaDesarrolloAttributes, 'id' | 'activo'> { }

class ProgramaDesarrollo extends Model<ProgramaDesarrolloAttributes, ProgramaDesarrolloCreationAttributes>
    implements ProgramaDesarrolloAttributes {
    public id!: number;
    public titulo!: string;
    public descripcion!: string;
    public archivo!: string;
    public activo!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProgramaDesarrollo.init(
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
        archivo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'programas_desarrollo',
    }
);

export default ProgramaDesarrollo;
