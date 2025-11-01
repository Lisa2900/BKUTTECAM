import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo simplificado
interface NosotrosContentAttributes {
  id: number;
  politicaIntegral: {
    imageSrc: string;
    title: string;
    description: string;
  };
  objetivoIntegral: string;
  vision: {
    imageSrc: string;
    title: string;
    description: string;
  };
  mision: {
    imageSrc: string;
    title: string;
    description: string;
  };
  valores: {
    imageSrc: string;
    title: string;
    description: string[];
  };
  noDiscriminacion: string[][];
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

// Atributos opcionales para creación
interface NosotrosContentCreationAttributes extends Optional<NosotrosContentAttributes, 'id'> {}

// Definir el modelo simplificado
class NosotrosContent extends Model<NosotrosContentAttributes, NosotrosContentCreationAttributes>
  implements NosotrosContentAttributes {
  public id!: number;
  public politicaIntegral!: {
    imageSrc: string;
    title: string;
    description: string;
  };
  public objetivoIntegral!: string;
  public vision!: {
    imageSrc: string;
    title: string;
    description: string;
  };
  public mision!: {
    imageSrc: string;
    title: string;
    description: string;
  };
  public valores!: {
    imageSrc: string;
    title: string;
    description: string[];
  };
  public noDiscriminacion!: string[][];

  // Timestamps automáticos
  public readonly fecha_creacion!: Date;
  public readonly fecha_actualizacion!: Date;
}

// Inicializar el modelo
NosotrosContent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    politicaIntegral: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        imageSrc: 'nosotros/general_1761952210799_4116c822a4a1655d910cbc50c09c95a3.png',
        title: 'Política Integral',
        description: 'Somos una institución comprometida en la formación de profesionistas con responsabilidad social, sentido humano y ético, que en conjunto con la comunidad universitaria, contribuyen al desarrollo sustentable a través de establecimiento de objetivos integrales, actualización e innovación de los programas educativos, gestión de la propiedad intelectual y la mejora continua del Sistema de Gestión Integral, considerando el desarrollo educativo, científico y técnico, cumpliendo el marco legal aplicable, considerando las necesidades y expectativas de las partes interesadas, atendiendo los criterios ambientales de manera que se pueda controlar y prevenir la contaminación derivada de nuestros procesos y servicios para la preservación del medio ambiente.'
      }
    },
    vision: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        imageSrc: 'nosotros/vision_1759772754247.png',
        title: 'Visión',
        description: 'En el año 2027 ser una institución de excelencia, reconocida Nacional e Internacionalmente por su eficiencia, eficacia, pertinencia, equidad, inclusión, vinculación y cuerpos académicos consolidados y comprometidos con las expectativas de los aprendientes y de la sociedad, al brindar educación de calidad y profesionistas con alto sentido humano, competitivos e integrados en el ámbito productivo'
      }
    },
    mision: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        imageSrc: 'nosotros/general_1761952064258_e361d82abad6d8113e2ec6074b4ef15a.png',
        title: 'Misión',
        description: 'Somos una Institución de Educación Superior comprometida con la excelencia, transparencia y rendición de cuentas, que brinda servicios educativos, científicos y tecnológicos con calidad, equidad, inclusión, responsabilidad social y sentido humano para contribuir al bienestar y desarrollo integral regional, estatal y nacional, cumpliendo los requerimientos de las partes interesadas, mediante un modelo formativo integral.'
      }
    },
    valores: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        imageSrc: 'nosotros/general_1761952189846_0697273e3d61620d3c56851a66ecec60.png',
        title: 'Valores',
        description: [
          'Austeridad',
          'Honestidad',
          'Empatía',
          'Generosidad',
          'Respeto',
          'Tolerancia',
          'Igualdad',
          'Equidad',
          'Justicia',
          'Fraternidad',
          'Compromiso',
          'Bien Común'
        ]
      }
    },
    objetivoIntegral: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Formar integralmente profesionistas competentes socialmente responsables, creativos, emprendedores e innovadores, comprometidos con el cuidado del medio ambiente y la sustentabilidad, a través del proceso enseñanza-aprendizaje, conducido por una planta docente con sentido humano, perfil profesional, experiencia y capacitación adecuada para la realización de su labor educativa.'
    },
    noDiscriminacion: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [
        [
          'Apariencia Física',
          'Cultura',
          'Discapacidad',
          'Idioma'
        ],
        [
          'Estado civil',
          'Religión',
          'Sexo',
          'Embarazo'
        ],
        [
          'Opiniones',
          'Origen étnico o nacional',
          'Género',
          'Edad'
        ]
      ]
    }
  },
  {
    sequelize,
    modelName: 'NosotrosContent',
    tableName: 'nosotros_content',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

// Exportar el modelo
export default NosotrosContent;