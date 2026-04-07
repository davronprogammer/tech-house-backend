import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'users.json');

async function ensureDbFile() {
    await mkdir(__dirname, { recursive: true });

    try {
        await readFile(DB_FILE, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await writeFile(DB_FILE, '[]', 'utf8');
            return;
        }

        throw error;
    }
}

export async function getUsers() {
    await ensureDbFile();
    const rawData = await readFile(DB_FILE, 'utf8');

    if (!rawData.trim()) {
        return [];
    }

    try {
        const users = JSON.parse(rawData);
        return Array.isArray(users) ? users : [];
    } catch (error) {
        throw new Error(`users.json format xato: ${error.message}`);
    }
}

export async function saveUsers(users) {
    await ensureDbFile();
    await writeFile(DB_FILE, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
}

export async function findUserByEmail(email) {
    const users = await getUsers();
    return users.find(user => user.email === email) || null;
}

export async function addUser(user) {
    const users = await getUsers();
    users.push(user);
    await saveUsers(users);
    return user;
}

export { DB_FILE };
