import sequelize, { connectDatabase } from '../../src/config/database';
import { DataTypes } from 'sequelize';

async function run() {
  try {
    await connectDatabase();
    const queryInterface = sequelize.getQueryInterface();

    console.log('Adding mapa_curricular column...');
    await queryInterface.addColumn('carreras', 'mapa_curricular', {
      type: DataTypes.JSON,
      allowNull: true,
    }).catch(err => {
      if (err.message.includes('Duplicate column')) {
        console.log('Column mapa_curricular already exists.');
      } else {
        throw err;
      }
    });

    console.log('Adding competencias column...');
    await queryInterface.addColumn('carreras', 'competencias', {
      type: DataTypes.TEXT, // Using TEXT to be safe, or JSON if MySQL 5.7+
      allowNull: true,
    }).catch(err => {
      if (err.message.includes('Duplicate column')) {
        console.log('Column competencias already exists.');
      } else {
        throw err;
      }
    });

    console.log('Adding atributos_egreso column...');
    await queryInterface.addColumn('carreras', 'atributos_egreso', {
      type: DataTypes.TEXT,
      allowNull: true,
    }).catch(err => {
      if (err.message.includes('Duplicate column')) {
        console.log('Column atributos_egreso already exists.');
      } else {
        throw err;
      }
    });

    console.log('Adding objetivos_educacionales column...');
    await queryInterface.addColumn('carreras', 'objetivos_educacionales', {
      type: DataTypes.TEXT,
      allowNull: true,
    }).catch(err => {
      if (err.message.includes('Duplicate column')) {
        console.log('Column objetivos_educacionales already exists.');
      } else {
        throw err;
      }
    });

    console.log('✅ Columns added successfully.');
    process.exit(0);
  } catch (err: any) {
    console.error('Error adding columns:', err);
    process.exit(1);
  }
}

run();
