import { Info, Code, BookOpen, Heart } from 'lucide-react';

export default function About() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      
      <section style={{ textAlign: 'center', backgroundColor: '#f8fafc', padding: '48px 24px', borderRadius: '32px', border: '4px solid #f1f5f9', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#e2e8f0', padding: '20px', borderRadius: '50%', marginBottom: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
          <Info size={48} color="#475569" />
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#1e293b', marginBottom: '16px', fontWeight: '900', letterSpacing: '-0.5px' }}>
          Tentang Kami
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: '600', maxWidth: '600px', margin: '0 auto' }}>
          Proyek Edukasi Interaktif - KKN Universitas Diponegoro 2026
        </p>
      </section>

      <section style={{ backgroundColor: '#ffffff', borderRadius: '32px', padding: 'clamp(24px, 5vw, 40px)', border: '2px solid #e2e8f0', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '50%', color: '#ef4444', display: 'flex' }}>
            <Heart size={32} fill="currentColor" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', fontWeight: '800', color: '#1e293b', margin: 0 }}>Latar Belakang Proyek</h2>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, marginBottom: '40px' }}>
          Website <b style={{ color: '#10b981' }}>Sahabat Bumi</b> dan Game <b style={{ color: '#10b981' }}>Detektif Sampah</b> dikembangkan sebagai bagian dari program Kuliah Kerja Nyata (KKN) Universitas Diponegoro tahun 2026 di Desa Cibelok, Kecamatan Taman, Kabupaten Pemalang. Kami menyadari bahwa kebiasaan memilah sampah dan menjaga kebersihan lingkungan harus ditanamkan sejak usia dini. Oleh karena itu, kami merancang media pembelajaran yang menyenangkan, interaktif, dan mudah diakses oleh anak-anak sekolah dasar.
        </p>
        
        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#334155', marginBottom: '20px', textAlign: 'center' }}>Tim Pengembang</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '24px' }}>
          <div style={{ backgroundColor: '#f0f9ff', padding: '32px 24px', borderRadius: '24px', border: '2px solid #bae6fd', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.1)' }}>
              <Code size={40} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>Regina</h3>
            <p style={{ color: '#0284c7', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>Software Engineer</p>
          </div>
          
          <div style={{ backgroundColor: '#f0fdf4', padding: '32px 24px', borderRadius: '24px', border: '2px solid #bbf7d0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)' }}>
              <BookOpen size={40} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>Khaterina</h3>
            <p style={{ color: '#16a34a', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>Naration Development</p>
          </div>
        </div>
      </section>

      <section style={{ textAlign: 'center', marginTop: '16px' }}>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '500' }}>
          Ada saran atau masukan? Silakan hubungi kami melalui pihak sekolah setempat.
        </p>
      </section>

    </div>
  );
}
