# Job App Tracker

![repository size](https://img.shields.io/github/repo-size/kei2511/job-app-tracker)
![last commit](https://img.shields.io/github/last-commit/kei2511/job-app-tracker)
![issues](https://img.shields.io/github/issues/kei2511/job-app-tracker)

Pelacak aplikasi kerja ringan dan elegan — dibuat dengan Next.js, Prisma, dan Tailwind CSS. Dirancang untuk membantu Anda mengelola lamaran kerja: status, catatan, dan timeline pada satu tempat.

## Fitur Utama

- Tampilan Kanban untuk memvisualisasikan tahap lamaran
- Formulir aplikasi yang mudah diisi (CV, posisi, link, catatan)
- Autentikasi pengguna (NextAuth)
- API routes minimal untuk CRUD aplikasi
- Prisma untuk manajemen database dan seed data

## Screenshot

> Tambahkan screenshot di folder `docs/` atau gunakan link gambar di bawah.

![screenshot-placeholder](docs/screenshot-1.png)

## Mulai Cepat (Local)

Persyaratan: Node 18+, pnpm/yarn/npm, dan PostgreSQL (atau database yang didukung Prisma).

1. Salin repo atau clone:

```bash
git clone https://github.com/kei2511/job-app-tracker.git
cd job-app-tracker
```

2. Instal dependensi:

```bash
npm install
# atau
pnpm install
```

3. Buat file environment:

Buat file `.env` berdasarkan contoh berikut (sesuaikan nilai Anda):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sebuah_rahasia_panjang
# Tambahkan variabel lain sesuai kebutuhan
```

4. Jalankan migrasi dan seed (jika ada):

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. Jalankan aplikasi:

```bash
npm run dev
# lalu buka http://localhost:3000
```

## Struktur Proyek (singkat)

- `app/` — route dan halaman Next.js (app router)
- `components/` — UI dan komponen yang dapat digunakan ulang
- `lib/` — utilitas, koneksi Prisma, dan tindakan server
- `prisma/` — skema Prisma

## Kontribusi

Semua kontribusi diterima! Untuk kontribusi kecil:

1. Fork repo
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m "feat: deskripsi"`
4. Push dan buat Pull Request

## Tips Penggunaan

- Jangan commit file `.env` — sudah ditambahkan ke `.gitignore`.
- Gunakan `pnpm` untuk install dan menjalankan lebih cepat jika tersedia.

## License

MIT — lihat file `LICENSE` jika ingin menambahkan lisensi.

---

Jika ingin, saya bisa:

- Menambahkan `docs/` dengan screenshot nyata dan GIF singkat alur kerja.
- Menyediakan `.env.example` di repo.
- Menambahkan badge CI / coverage jika Anda menggunakan workflow.

## Features

- Kanban board for visualizing job applications
- CRUD operations for job applications
- Automated "ghosting" reminders
- Dashboard with application statistics
- Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Prisma ORM
- @hello-pangea/dnd for drag-and-drop

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file with your database URL:

```env
DATABASE_URL="your_postgresql_connection_string"
```

3. Set up the database:

```bash
npx prisma db push
```

4. Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000
