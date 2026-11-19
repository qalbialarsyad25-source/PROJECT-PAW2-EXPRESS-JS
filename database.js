const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

// Inisialisasi file database SQLite lokal
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new DatabaseSync(dbPath);

// 1. Buat Tabel Mahasiswa (1 Tabel CRUD)
db.exec(`
  CREATE TABLE IF NOT EXISTS mahasiswa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nim TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    jurusan TEXT NOT NULL,
    angkatan INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 2. Isi data awal (seed) jika tabel masih kosong
const countQuery = db.prepare('SELECT COUNT(*) AS total FROM mahasiswa').get();
if (countQuery.total === 0) {
  const insert = db.prepare(`
    INSERT INTO mahasiswa (nim, nama, jurusan, angkatan)
    VALUES (?, ?, ?, ?)
  `);

  insert.run('220001', 'Ahmad Pratama', 'Teknik Informatika', 2022);
  insert.run('220002', 'Siti Nurhaliza', 'Sistem Informasi', 2022);
  insert.run('230003', 'Budi Santoso', 'Teknik Komputer', 2023);
  console.log('Data awal (sample) berhasil dimasukkan ke tabel mahasiswa.');
}

module.exports = db;
