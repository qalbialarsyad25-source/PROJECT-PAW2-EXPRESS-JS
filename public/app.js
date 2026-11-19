// URL Base API
const API_URL = '/api/mahasiswa';

// DOM Elements
const form = document.getElementById('mahasiswaForm');
const editIdInput = document.getElementById('editId');
const nimInput = document.getElementById('nim');
const namaInput = document.getElementById('nama');
const jurusanInput = document.getElementById('jurusan');
const angkatanInput = document.getElementById('angkatan');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancel = document.getElementById('btnCancel');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const totalDataCount = document.getElementById('totalDataCount');
const alertBox = document.getElementById('alertBox');

// Tampilkan Pesan Notifikasi (Toast / Alert)
function showAlert(message, type = 'success') {
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.classList.remove('hidden');

  setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 4000);
}

// 1. READ: Ambil dan Tampilkan Data Mahasiswa
async function fetchMahasiswa(search = '') {
  try {
    let url = API_URL;
    if (search.trim()) {
      url += `?search=${encodeURIComponent(search.trim())}`;
    }

    const response = await fetch(url);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    renderTable(result.data);
  } catch (error) {
    showAlert(`Gagal memuat data: ${error.message}`, 'danger');
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Gagal memuat data mahasiswa</td></tr>`;
  }
}

// Render Data ke Tabel
function renderTable(mahasiswaList) {
  totalDataCount.textContent = `Total: ${mahasiswaList.length} mahasiswa`;

  if (mahasiswaList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center" style="padding: 2rem; color: #64748b;">
          Tidak ada data mahasiswa ditemukan.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = mahasiswaList
    .map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${escapeHtml(item.nim)}</strong></td>
        <td>${escapeHtml(item.nama)}</td>
        <td><span class="badge-jurusan">${escapeHtml(item.jurusan)}</span></td>
        <td>${item.angkatan}</td>
        <td class="text-center">
          <div class="action-buttons">
            <button class="btn btn-edit btn-sm" onclick="startEdit(${item.id})">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteMahasiswa(${item.id}, '${escapeHtml(item.nama)}')">🗑️ Hapus</button>
          </div>
        </td>
      </tr>
    `)
    .join('');
}

// 2. CREATE & UPDATE: Tangani Submit Form
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = editIdInput.value;
  const payload = {
    nim: nimInput.value.trim(),
    nama: namaInput.value.trim(),
    jurusan: jurusanInput.value.trim(),
    angkatan: Number(angkatanInput.value)
  };

  try {
    let response;
    if (id) {
      // Mode UPDATE (PUT)
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Mode CREATE (POST)
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    showAlert(result.message, 'success');
    resetForm();
    fetchMahasiswa(searchInput.value);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
});

// 3. EDIT: Siapkan Form untuk Mode Edit
async function startEdit(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    const data = result.data;
    editIdInput.value = data.id;
    nimInput.value = data.nim;
    namaInput.value = data.nama;
    jurusanInput.value = data.jurusan;
    angkatanInput.value = data.angkatan;

    formTitle.textContent = '✏️ Edit Data Mahasiswa';
    formSubtitle.textContent = `Mengubah data NIM: ${data.nim}`;
    btnSubmit.textContent = 'Perbarui Data';
    btnCancel.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showAlert(`Gagal mengambil detail: ${error.message}`, 'danger');
  }
}

// Batal Edit
btnCancel.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  editIdInput.value = '';
  formTitle.textContent = '➕ Tambah Mahasiswa';
  formSubtitle.textContent = 'Masukkan informasi mahasiswa baru';
  btnSubmit.textContent = 'Simpan Data';
  btnCancel.classList.add('hidden');
}

// 4. DELETE: Hapus Data Mahasiswa
async function deleteMahasiswa(id, nama) {
  const konfirmasi = confirm(`Apakah Anda yakin ingin menghapus mahasiswa "${nama}"?`);
  if (!konfirmasi) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    showAlert(result.message, 'success');
    if (editIdInput.value == id) {
      resetForm();
    }
    fetchMahasiswa(searchInput.value);
  } catch (error) {
    showAlert(`Gagal menghapus: ${error.message}`, 'danger');
  }
}

// 5. SEARCH / FILTER: Pencarian Real-Time dengan Debounce
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchMahasiswa(e.target.value);
  }, 300);
});

// Helper Escape HTML untuk cegah XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Inisialisasi awal saat halaman dibuka
fetchMahasiswa();
