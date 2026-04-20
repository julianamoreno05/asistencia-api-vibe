import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

// Inicializar data.json si no existe
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ students: [], attendance: [] }, null, 2));
}

export const readData = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

export const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Utilidad para generar ID EST0000X
export const generateStudentId = () => {
  const data = readData();
  const count = data.students.length + 1;
  // Pad con ceros a la izquierda, total 5 digitos
  const paddedCount = String(count).padStart(5, '0');
  return `EST${paddedCount}`;
};
