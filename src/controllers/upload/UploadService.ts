import { UploadedFile } from "express-fileupload";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';


const TEMP_DIR = path.resolve(process.cwd(), 'temp_uploads'); // misma carpeta que el middleware

interface SavedFile {
  tempFilePath: string;
  filename: string;
  mimetype: string;
}



export class UploadService {
  constructor() {

  }


  async savedFile(file: UploadedFile): Promise<SavedFile> {
    //* Se verifica que exista la carpeta "temp_uploads"

    try {
      if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR, { recursive: true });
      }

      //*Generacion de nombre unico y guardado del archivo
      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext).replace(/\s+/g, '_');
      const uniqueName = `${baseName}_${uuidv4()}_${Date.now()}${ext}`;
      const newPath = path.join(TEMP_DIR, uniqueName);
      await file.mv(newPath);

      return {
        tempFilePath: newPath,
        filename: uniqueName,
        mimetype: file.mimetype
      };
    } catch (error) {
      throw new Error(`Error saving file: ${error}`);
    }

  }


  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      throw new Error(`Error deleting file: ${error}`);
    }
  }
}
