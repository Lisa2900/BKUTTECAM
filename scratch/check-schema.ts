import sequelize from '../src/config/database';

async function checkSchema() {
  try {
    // Check if column exists first
    const [columns]: any = await sequelize.query('SHOW COLUMNS FROM beca_sections LIKE "module"');
    if (columns.length === 0) {
      console.log('Adding module column...');
      await sequelize.query('ALTER TABLE beca_sections ADD COLUMN module ENUM("becas", "estadia") DEFAULT "becas" AFTER id');
      console.log('Column added.');
    } else {
      console.log('Module column already exists.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error checking schema:', error);
    process.exit(1);
  }
}

checkSchema();
