import { BookOpen, Target, Users } from 'lucide-react';

export default function Teacher() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      
      <section style={{ textAlign: 'center', backgroundColor: '#e0f2fe', padding: '48px 24px', borderRadius: '32px', border: '4px solid #bae6fd' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0369a1', marginBottom: '16px', fontWeight: '900' }}>
          Untuk Guru & Orang Tua
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#0284c7', fontWeight: '600', maxWidth: '600px', margin: '0 auto' }}>
          Panduan pendampingan untuk memaksimalkan pengalaman belajar anak.
        </p>
      </section>

      <section style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '2px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#dbeafe', padding: '16px', borderRadius: '50%', color: '#2563eb', display: 'flex' }}>
            <Target size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Tujuan Pembelajaran</h2>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
          Game "Detektif Sampah" dirancang khusus untuk siswa sekolah dasar (berusia 10-11 tahun) guna memperkenalkan konsep dasar pelestarian lingkungan. Melalui pendekatan <i>game-based learning</i>, anak diajak untuk:
        </p>
        <ul style={{ paddingLeft: '24px', fontSize: '1.1rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: 1.6 }}>
          <li>Memahami perbedaan mendasar antara sampah organik dan anorganik.</li>
          <li>Mengetahui cara memilah sampah yang benar dan membuangnya pada tempat yang sesuai.</li>
          <li>Memahami dampak buruk membuang sampah sembarangan (seperti selokan tersumbat dan banjir).</li>
          <li>Mengenal prinsip 3R (Reduce, Reuse, Recycle) dalam kehidupan sehari-hari.</li>
        </ul>
      </section>

      <section style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '2px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#dcfce7', padding: '16px', borderRadius: '50%', color: '#16a34a', display: 'flex' }}>
            <BookOpen size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Materi Edukasi</h2>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.7 }}>
          Website ini dilengkapi dengan halaman <b style={{ color: '#15803d' }}>Belajar Yuk!</b> yang berisi kartu-kartu interaktif. Materi disajikan secara sangat ringkas dan visual untuk menghindari kebosanan membaca teks panjang. Anda dapat mengajak anak untuk mengeksplorasi halaman tersebut sebelum atau sesudah bermain <i>game</i>.
        </p>
      </section>

      <section style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '2px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#f3e8ff', padding: '16px', borderRadius: '50%', color: '#9333ea', display: 'flex' }}>
            <Users size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Saran Diskusi</h2>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>
          Untuk memperkuat pemahaman, kami menyarankan agar Bapak/Ibu mengajak anak berdiskusi setelah mereka menyelesaikan permainan. Beberapa pertanyaan pemantik yang bisa digunakan:
        </p>
        <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
          <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '1.15rem', color: '#334155', fontWeight: '600' }}>
            <li style={{ paddingBottom: '8px', borderBottom: '1px dashed #cbd5e1' }}>"Dari semua kasus di game, mana yang paling susah diselesaikan? Kenapa?"</li>
            <li style={{ paddingBottom: '8px', borderBottom: '1px dashed #cbd5e1' }}>"Kalau di rumah kita, kira-kira sampah apa yang paling banyak dihasilkan?"</li>
            <li>"Apa satu hal kecil yang bisa kita mulai lakukan hari ini untuk mengurangi sampah?"</li>
          </ul>
        </div>
      </section>

    </div>
  );
}
