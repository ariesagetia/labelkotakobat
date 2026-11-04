# Apotek Label Master - Generator Label Kotak Obat

Aplikasi web modern untuk membuat, mengatur, dan mencetak label kotak obat farmasi dengan kode warna kategori otomatis & kustom, dirancang sesuai dengan spesifikasi dan tata letak **Lampiran 1** (15 label per lembar A4, 3 kolom × 5 baris) dan dataset lengkap **Lampiran 2** (1,118 item obat).

---

## Fitur Utama

1. **Tata Letak & Desain Sesuai Lampiran 1**:
   - **Grid 3 Kolom × 5 Baris** (15 label per lembar kertas A4/F4).
   - Format label 3 bagian:
     - **Baris 1**: Nama Obat & Dosis (contoh: `AERIUS 5 MG`, `ALLERON 4 MG`).
     - **Baris 2**: Bentuk & Kemasan (contoh: `TAB @30`, `KAP @100`).
     - **Garis Pemisah Penuh**: Garis pemisah tegas dari ujung kanan ke ujung kiri sepanjang lebar kotak label.
     - **Baris 3**: Kandungan / Komposisi Zat Aktif (contoh: `DESLORATADIN 5MG`).
   - Garis batas pemotongan (solid, dashed/putus-putus untuk gunting, dotted, atau tanpa garis).

2. **Kustomisasi Tipografi & Font Lengkap**:
   - Pilihan berbagai jenis huruf (Font Family): **Montserrat** (default apotek), **Arial**, **Inter**, **Roboto**, **Poppins**, **Oswald**, **Times New Roman**, **Courier New**, dan sistem.
   - Pilihan warna huruf bebas atau preset: **Auto Kontras**, **Putih Murni**, **Hitam Pekat**, dan **Kuning Farmasi**.
   - Slider dan preset ukuran font: ukuran nama obat, bentuk & kemasan, serta kandungan dapat diatur secara independen.
   - Pilihan ketebalan huruf (*Font Weight*: Semi Bold hingga Black 900) dan opsi *Uppercase* (Kapital).

3. **Pilihan Mode Background Label**:
   - **Mode Berwarna (Kategori)**: Kotak label berlatar belakang warna solid sesuai masing-masing kategori obat (seperti contoh Lampiran 1).
   - **Mode Putih Polos (Hemat Tinta)**: Kotak label berlatar putih bersih dengan teks hitam pekat, serta border & pemisah tetap berwarna kategori agar tetap mudah diidentifikasi tanpa memboroskan tinta printer.

4. **Kustomisasi Warna Kategori Fleksibel**:
   - Setiap kategori obat (`ALERGI`, `ANTIBIOTIK`, `GENERIK`, `NYERI`, `MULTIVITAMIN`, `PENCERNAAN`, `PERNAFASAN`, `SALEP`, `SARAF`, `HORMON`, `OBAT BEBAS`, dll.) memiliki warna label tersendiri.
   - Pemilih warna bebas (*Color Picker*) & palet cepat warna farmasi standar.
   - Pilihan kategori aktif: pengguna dapat memilih mencetak semua kategori atau hanya kategori tertentu.
   - Preset tema: *Ungu Lampiran 1*, *Pastel Farmasi*, dan *Kontras Tinggi*.

5. **Upload & Pemrosesan File Excel / CSV (Lampiran 2)**:
   - Dukungan file `.xlsx`, `.xls`, dan `.csv`.
   - Deteksi kolom otomatis (`Item`, `KATEGORI`, `KANDUNGAN`).
   - Parsing otomatis nama obat, sediaan (`TAB`, `KAP`, `SYR`, `CR`, dll.), dan jumlah kemasan (`@30`, `@100`, `60 ML`, `5 GR`).
   - Pilihan impor: *Ganti semua data* atau *Tambahkan ke data saat ini*.
   - Tersedia tombol 1-klik **"Contoh Lampiran 2"** untuk memuat langsung 1,118 item obat tanpa perlu upload.

6. **Tabel Editor & Pengisian Kemasan Massal**:
   - Pencarian obat instan berdasarkan nama, kandungan, atau kategori.
   - Edit teks langsung (nama, kemasan `@...`, kandungan) baik di tabel maupun dengan mengklik label pada lembar pratinjau.
   - Tombol duplikat dan tambah obat baru.
   - Fitur *Isi Kemasan Massal* (contoh: isi `@100` ke semua obat yang belum memiliki kemasan).

7. **Pratinjau Lembar & Cetak Anti-Terpotong**:
   - Format cetak terisolasi `@page { margin: 0; }` sehingga 15 label tertata presisi dalam 1 halaman utuh tanpa ada baris yang terpotong ke halaman berikutnya.
   - Area kertas dan margin luar dipaksa putih polos murni 100% tanpa ada sisa warna latar belakang aplikasi.
   - Kontrol zoom pratinjau (50% - 120%).
   - Cetak langsung via browser (`Ctrl + P`) dengan resolusi vektor tajam (300+ DPI) atau simpan sebagai file PDF.

---

## Teknologi yang Digunakan

- **React 19**
- **Vite 6**
- **Tailwind CSS v4**
- **Lucide React** (Ikonografi)
- **SheetJS (xlsx)** (Pemrosesan Excel/CSV di sisi klien tanpa server)

---

## Cara Menjalankan Secara Lokal

```bash
# 1. Clone repositori
git clone https://github.com/ariesagetia/labelkotakobat.git
cd labelkotakobat

# 2. Instal dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka peramban (browser) di: `http://localhost:3000`

---

## Panduan Pengaturan Cetak Browser (Print Settings)

1. Klik tombol **"CETAK LABEL"** di pojok kanan atas atau tekan `Ctrl + P`.
2. Pada dialog cetak peramban (Chrome / Edge / Firefox):
   - **Tujuan (Destination)**: Pilih printer fisik Anda atau *Simpan sebagai PDF*.
   - **Halaman (Pages)**: Semua, atau pilih nomor lembar tertentu.
   - **Tata Letak (Layout)**: Tegak (*Portrait*).
   - **Ukuran Kertas (Paper Size)**: A4 (210 × 297 mm).
   - **Margin**: *Default* atau *None*.
   - **Skala (Scale)**: *Default* (100%).
   - **Opsi**: Centang **☑ Grafik latar belakang (Background graphics)** agar warna latar label tercetak sempurna.
