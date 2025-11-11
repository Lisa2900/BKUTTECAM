import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Enum para los tipos de contenido
enum TipoContenido {
  VISION = 'vision',
  MISION = 'mision',
  VALORES = 'valores',
  POLITICA_INTEGRAL = 'politica_integral',
  OBJETIVO_INTEGRAL = 'objetivo_integral',
  POLITICA_IGUALDAD = 'politica_igualdad'
}

// Definir atributos del modelo
interface NosotrosContenidoAttributes {
  id: number;
  tipo: TipoContenido;
  titulo: string;
  descripcion?: string | null;
  imagen?: string | null;
  lista?: string[] | null; // JSON array
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

// Atributos opcionales para creación
interface NosotrosContenidoCreationAttributes 
  extends Optional<NosotrosContenidoAttributes, 'id' | 'descripcion' | 'imagen' | 'lista'> {}

// Definir el modelo
class NosotrosContenido extends Model<NosotrosContenidoAttributes, NosotrosContenidoCreationAttributes> 
  implements NosotrosContenidoAttributes {
  public id!: number;
  public tipo!: TipoContenido;
  public titulo!: string;
  public descripcion!: string | null;
  public imagen!: string | null;
  public lista!: string[] | null;
  
  // Timestamps automáticos
  public readonly fechaCreacion!: Date;
  public readonly fechaActualizacion!: Date;
}

// Inicializar el modelo
NosotrosContenido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.ENUM(
        'vision',
        'mision',
        'valores',
        'politica_integral',
        'objetivo_integral',
        'politica_igualdad'
      ),
      allowNull: false,
      validate: {
        isIn: {
          args: [[
            'vision',
            'mision',
            'valores',
            'politica_integral',
            'objetivo_integral',
            'politica_igualdad'
          ]],
          msg: 'Tipo de contenido no válido'
        }
      }
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título no puede estar vacío'
        },
        len: {
          args: [1, 255],
          msg: 'El título debe tener entre 1 y 255 caracteres'
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      validate: {
        len: {
          args: [0, 255],
          msg: 'La ruta de la imagen no puede exceder 255 caracteres'
        }
      }
    },
    lista: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      get() {
        const rawValue = this.getDataValue('lista');
        // Si es string (viene de la BD como JSON), parsearlo
        if (typeof rawValue === 'string') {
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            return null;
          }
        }
        return rawValue;
      },
      set(value: string[] | null) {
        // Sequelize maneja automáticamente la conversión a JSON
        this.setDataValue('lista', value);
      }
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_actualizacion'
    }
  },
  {
    sequelize,
    modelName: 'NosotrosContenido',
    tableName: 'nosotros_contenido',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    underscored: true,
    indexes: [
      {
        unique: false,
        fields: ['tipo']
      },
      {
        unique: false,
        fields: ['fecha_creacion']
      }
    ]
  }
);

export default NosotrosContenido;
export { NosotrosContenidoAttributes, NosotrosContenidoCreationAttributes, TipoContenido };