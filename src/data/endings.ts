import { EmotionMetrics, EndingDefinition, EndingId, SideQuestProgress } from '../types/game';

export const ENDINGS: Record<EndingId, EndingDefinition> = {
  secret: {
    id: 'secret',
    label: 'Secret Ending',
    title: 'Lagu yang Belum Selesai',
    subtitle: 'Semua kenangan kecil yang kamu temukan menyusun kembali jati diri Damar.',
    accentColor: '#f6d17a',
    epilogueParagraphs: [
      'Malam itu tidak ada lagi keheningan yang canggung di rumah Jl. Melati No. 14. Di atas meja makan, buku catatan lirik dari rooftop Menara Nusantara terbuka berdampingan dengan gambar krayon Kira dan gembok kenangan dari jembatan lama.',
      'Keesokan sorenya—tepat pukul lima, saat langit kota masih berwarna madu—Damar berjalan masuk lewat pagar depan sambil menenteng sebuah koper gitar kayu mahoni yang selama enam tahun dijaga diam-diam oleh Bima dan Mas Bagas.',
      'Kira berlari menyambut sambil tertawa, sementara Nadia terdiam di ambang pintu dengan mata yang langsung berkaca-kaca. Ia akhirnya mengerti mengapa Damar dulu diam-diam melepaskan gitar itu saat malam kelahiran Kira—bukan karena ia berhenti bermimpi, melainkan karena ia mencintai mereka lebih dari apa pun.',
      'Di ruang tamu yang lampunya menyala hangat, Damar duduk di lantai kayu. Ia memetik akor pertama yang sudah lama tertunda. Suaranya sedikit bergetar, tapi utuh. Kira ikut menepuk tangan pelan, dan Nadia menyandarkan kepalanya di bahu Damar. Lagu "Pulang" akhirnya selesai ditulis.',
    ],
    finalQuote: '"Kita tidak pernah benar-benar kehilangan diri sendiri; kadang kita hanya terlalu jauh berjalan sampai lupa jalan pulang."',
    unlockHint: 'Temukan minimal 10 Fragmen Memori (atau hidupkan 3 Kilas Balik Sinematik + 6 Memori) termasuk buku catatan di Rooftop, serta pilih kejujuran di meja makan.',
  },
  true: {
    id: 'true',
    label: 'True Ending',
    title: 'Cahaya di Meja Makan',
    subtitle: 'Keterbukaan penuh dan empati menyembuhkan Damar, Nadia, dan Kira bersama-sama.',
    accentColor: '#e7b87d',
    epilogueParagraphs: [
      'Air mata yang selama ini mereka tahan jatuh bersamaan di meja makan malam itu. Untuk pertama kalinya setelah bertahun-tahun, Damar tidak lagi memasang wajah "semuanya baik-baik saja", dan Nadia tidak lagi menyembunyikan rasa lelahnya di balik senyum sopan.',
      'Damar bercerita tentang ketakutannya gagal sebagai kepala keluarga, tentang rasa iri kecil setiap kali melihat orang lain bebas bermimpi, dan betapa sepinya berdiri di ruang kaca kantor sendirian. Nadia menggenggam tangannya erat, berbisik bahwa ia tidak pernah meminta Damar menjadi sempurna—ia hanya ingin Damar tetap menjadi teman hidupnya.',
      'Seminggu kemudian, Damar berbicara jujur kepada Pak Hendra untuk menata ulang batas jam kerjanya. Tidak semua ambisi dikejar sekaligus, namun setiap akhir pekan kini diisi tawa Kira belajar bersepeda di ujung gang, kopi sore bersama Bima, dan sapaan hangat kepada tetangga yang dulu hanya ia lewati.',
      'Rumah itu mungkin tetap sederhana. Tetapi setiap kali Damar membuka pintu pagar menjelang senja, lampu ruang makan selalu menyala terang—dan kali ini, hatinya benar-benar ikut pulang.',
    ],
    finalQuote: '"Rumah bukan tempat di mana hidup tidak punya masalah, melainkan tempat di mana kita tidak harus pura-pura kuat sendirian."',
    unlockHint: 'Jujur kepada Nadia dan dirimu sendiri, hadir untuk keluarga, dan selesaikan minimal 4 misi sampingan warga kota.',
  },
  good: {
    id: 'good',
    label: 'Good Ending',
    title: 'Pulang ke Diri Sendiri',
    subtitle: 'Damar mulai menemukan keseimbangan baru yang lebih sehat dan jujur.',
    accentColor: '#98c1a9',
    epilogueParagraphs: [
      'Percakapan malam itu tidak langsung menyelesaikan seluruh kerumitan hidup dalam semalam. Masih ada cicilan yang harus dibayar, masih ada target kantor yang kadang membuat bahu Damar terasa berat.',
      'Namun ada satu hal besar yang berubah sejak malam itu: Damar berhenti melarikan diri. Ia akhirnya berani mengakui kepada Nadia bahwa ia kelelahan, dan berjanji berhenti membawa pulang kegelisahan kantor ke meja makan.',
      'Pelan-pelan, Damar menyisihkan waktu setiap Rabu sore untuk mampir ke Kedai Kopi Bima sekadar memetik gitar setengah jam, lalu pulang tepat waktu sebelum Kira selesai mewarnai buku gambarnya.',
      'Hidup tetap berjalan seperti biasa—hanya saja, kali ini Damar tidak lagi merasa seperti tamu di dalam hidupnya sendiri.',
    ],
    finalQuote: '"Berhenti sebentar bukan berarti kalah; terkadang itulah satu-satunya cara agar kita tidak kehilangan arah."',
    unlockHint: 'Seimbangkan kejujuran diri dan kehadiran untuk keluarga saat menghadapi pilihan penting di Bab 2 dan Bab 3.',
  },
  bad: {
    id: 'bad',
    label: 'Bad Ending',
    title: 'Bayangan di Kaca Kantor',
    subtitle: 'Damar memilih terus berlari ke dalam pekerjaan dan memendam semua yang ia rasakan.',
    accentColor: '#8ba3be',
    epilogueParagraphs: [
      'Tiga bulan kemudian, nama Damar Pratama resmi naik jabatan di Menara Nusantara. Gaji bulanannya meningkat, bonus proyek cair tepat waktu, dan Pak Hendra menepuk bahunya penuh bangga di depan seluruh divisi.',
      'Namun setiap kali ia pulang pukul sepuluh malam, rumah di Jl. Melati No. 14 selalu sunyi. Sepatu kecil Kira sudah rapi di rak, dan makanan di atas meja ditutup tudung saji dengan catatan singkat dari Nadia: "Sudah kuhangatkan tadi sore."',
      'Nadia tidak lagi marah, tidak lagi bertanya mengapa ia pulang larut. Dan entah kenapa, keheningan tanpa pertanyaan itu terasa jauh lebih dingin daripada pertengkaran mana pun.',
      'Di balik kaca jendela lantai delapan belas yang memantulkan gemerlap lampu kota, Damar menatap bayangan pria rapi berdasi yang tampak berhasil di atas kertas—namun ia sama sekali tidak lagi mengenali siapa orang di kaca itu.',
    ],
    finalQuote: '"Kita bisa membeli hampir semua hal dengan waktu yang kita korbankan, kecuali waktu itu sendiri."',
    unlockHint: 'Terus memilih ambisi pekerjaan, lembur, dan menutupi perasaan dari Nadia hingga akhir cerita.',
  },
};

export function evaluateEnding(params: {
  emotions: EmotionMetrics;
  sideQuests: Record<string, SideQuestProgress>;
  discoveredEasterEggs: string[];
  flags: string[];
}): EndingId {
  const { emotions, sideQuests, discoveredEasterEggs, flags } = params;
  const completedSideQuests = Object.values(sideQuests).filter((s) => s.status === 'completed').length;
  const easterCount = discoveredEasterEggs.length;
  const choseWorkEscape = flags.includes('ch3_chose_escape_work');
  const hasRooftopNote = flags.includes('found_rooftop_notebook') || discoveredEasterEggs.includes('ee_buku_rooftop');
  const allThreeFlashbacks =
    flags.includes('flashback_2018_done') &&
    flags.includes('flashback_2020_done') &&
    flags.includes('flashback_dinner_done');

  // 1. Secret Ending: mengumpulkan banyak Fragmen Memori ATAU menghidupkan 3 Kilas Balik + buku rooftop + jujur di akhir
  if (
    !choseWorkEscape &&
    hasRooftopNote &&
    (easterCount >= 10 || (allThreeFlashbacks && easterCount >= 6))
  ) {
    return 'secret';
  }

  // 2. Bad Ending: dominan ambisi/pelarian atau memilih menutup diri di akhir Bab 3
  if (
    choseWorkEscape ||
    (emotions.ambisiPelarian >= 6 && emotions.ambisiPelarian > emotions.kejujuranDiri + emotions.kehadiranKeluarga - 2)
  ) {
    return 'bad';
  }

  // 3. True Ending: kejujuran tinggi + kehadiran keluarga tinggi + empati lewat misi sampingan
  if (
    completedSideQuests >= 4 &&
    emotions.kejujuranDiri >= 7 &&
    emotions.kehadiranKeluarga >= 7 &&
    emotions.ambisiPelarian <= 4
  ) {
    return 'true';
  }

  // 4. Good Ending: keseimbangan sehat dan kejujuran yang bertumbuh
  return 'good';
}
