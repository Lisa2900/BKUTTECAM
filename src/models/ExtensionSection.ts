import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface ExtensionSectionAttributes {
  id?: number;
  slug: string;
  title: string;
  description?: string;
  banner_url?: string;
  is_enabled?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

class ExtensionSection extends Model<ExtensionSectionAttributes> implements ExtensionSectionAttributes {
  public id!: number;
  public slug!: string;
  public title!: string;
  public description!: string;
  public banner_url!: string;
  public is_enabled!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

ExtensionSection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    banner_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'extension_sections',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default ExtensionSection;
