import { BookOpen, Leaf, Recycle, Trash2, AlertTriangle, Lightbulb } from 'lucide-react';

function EduCard({ icon, title, content, colorClass }: { icon: React.ReactNode, title: string, content: React.ReactNode, colorClass: string }) {
  return (
    <div className="card flex flex-col items-start gap-4 h-full">
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="text-muted text-sm flex-grow w-full">{content}</div>
    </div>
  );
}

export default function Learn() {
  return (
    <div className="flex flex-col gap-12">
      {/* Header Section */}
      <section className="text-center bg-primary-light rounded-3xl p-12 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 text-primary opacity-20">
          <BookOpen size={200} />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl text-primary mb-4">Edukasi Sampah</h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Mari belajar mengenali sampah, cara memilah, dan langkah kecil yang bisa kita lakukan untuk menyelamatkan bumi kita tercinta!
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EduCard 
          icon={<Trash2 size={32} />}
          title="Apa itu Sampah?"
          colorClass="bg-gray-100 text-gray-600"
          content={
            <p>
              Sampah adalah barang atau sisa-sisa yang sudah tidak digunakan lagi oleh manusia. Jika tidak dibuang pada tempatnya, sampah bisa membuat lingkungan menjadi kotor dan sarang penyakit.
            </p>
          }
        />

        <EduCard 
          icon={<Leaf size={32} />}
          title="Jenis Sampah"
          colorClass="bg-green-100 text-primary"
          content={
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><b>Organik:</b> Mudah membusuk (contoh: sisa makanan, kulit buah, daun kering). Bisa dijadikan pupuk kompos.</li>
              <li><b>Anorganik:</b> Sulit hancur/membusuk (contoh: plastik, kaleng, botol kaca). Harus didaur ulang.</li>
            </ul>
          }
        />

        <EduCard 
          icon={<Recycle size={32} />}
          title="Cara Memilah"
          colorClass="bg-blue-100 text-blue-600"
          content={
            <p>
              Pisahkan tempat sampah di rumahmu menjadi dua: satu untuk organik (warna hijau) dan satu untuk anorganik (warna kuning/biru). Pastikan sampah anorganik dalam keadaan kering dan bersih sebelum dibuang!
            </p>
          }
        />

        <EduCard 
          icon={<AlertTriangle size={32} />}
          title="Dampak Sampah"
          colorClass="bg-red-100 text-red-600"
          content={
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Banjir karena selokan tersumbat.</li>
              <li>Penyakit (demam berdarah, diare).</li>
              <li>Bau tidak sedap dan merusak keindahan lingkungan.</li>
              <li>Membahayakan hewan laut jika sampah sampai ke sungai dan laut.</li>
            </ul>
          }
        />

        <EduCard 
          icon={<Recycle size={32} />}
          title="Prinsip 3R"
          colorClass="bg-yellow-100 text-accent"
          content={
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><b>Reduce (Kurangi):</b> Kurangi penggunaan barang sekali pakai (contoh: bawa tas belanja sendiri).</li>
              <li><b>Reuse (Gunakan kembali):</b> Gunakan barang berulang kali (contoh: botol minum / tumbler).</li>
              <li><b>Recycle (Daur ulang):</b> Ubah sampah jadi barang baru (contoh: kerajinan dari botol plastik).</li>
            </ul>
          }
        />

        <EduCard 
          icon={<Lightbulb size={32} />}
          title="Tips Menjaga Lingkungan"
          colorClass="bg-purple-100 text-purple-600"
          content={
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Selalu buang sampah pada tempatnya, di mana pun kamu berada.</li>
              <li>Bawa botol minum dan kotak bekal sendiri dari rumah.</li>
              <li>Ingatkan teman dan keluarga jika melihat mereka membuang sampah sembarangan.</li>
              <li>Ikut kerja bakti membersihkan lingkungan.</li>
            </ul>
          }
        />
      </section>
      
      {/* Call to Action */}
      <section className="bg-primary text-white rounded-3xl p-8 text-center mt-4">
        <h2 className="text-3xl mb-4">Yuk, Jadi Pahlawan Lingkungan!</h2>
        <p className="mb-6 text-green-100">
          Semua hal besar dimulai dari langkah kecil. Mulai hari ini, mari kita jaga bumi kita agar tetap bersih dan sehat.
        </p>
      </section>
    </div>
  );
}
