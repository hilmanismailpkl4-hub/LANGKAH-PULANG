import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Monolog Batin & Kejujuran Diri:
 * "Kalimat yang Tak Pernah Dicetak" — Draf Surat Pukul 02.14 di Laci Bawah Meja Kerja Damar
 * Lokasi: Laci Bawah Meja Kerja Rumah Jl. Melati No. 14 (`[-23.15, 0.08, 71.35]`)
 *
 * Menyingkap selembar kertas HVS yang separuh tercetak sebelas bulan lalu pukul dua pagi:
 * berawal sebagai surat pengunduran diri dari Menara Nusantara, namun berubah menjadi
 * pengakuan jujur seorang suami dan ayah yang takut kehilangan dirinya sendiri.
 */
export const MIDNIGHT_DRAFT_DIALOGUES: Record<string, DialogueScript> = {
  story_midnight_draft_drawer: {
    id: 'story_midnight_draft_drawer',
    startNodeId: 'smd_1',
    flashback: {
      yearLabel: 'SEBELAS BULAN LALU · PUKUL 02.14 WIB',
      title: 'Kalimat yang Tak Pernah Dicetak',
      locationLabel: 'Meja Kerja Sudut Rumah Jl. Melati No. 14',
      mood: 'quiet_night',
      epigraph: 'Di dasar laci yang terkunci debu, tersimpan kalimat paling jujur yang pernah kamu ketik saat seluruh rumah tertidur.',
    },
    nodes: {
      smd_1: {
        id: 'smd_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Laci kayu paling bawah di samping meja kerja Damar berderit pelan saat ditarik. Di bawah gulungan kabel lama dan kuitansi servis motor, terselip selembar kertas HVS krem yang terlipat empat.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'smd_2',
      },
      smd_2: {
        id: 'smd_2',
        speaker: 'damar_batin',
        emotion: 'ragu',
        text: 'Jantungku berhenti sedetik melihat baris huruf yang makin memudar di tengah halaman karena printer kehabisan tinta malam itu. Aku ingat persis malam sebelas bulan lalu saat mengetiknya—pukul 02.14 dini hari, tepat sehabis rapat revisi yang memakanku habis-habisan.',
        nextNodeId: 'smd_3',
      },
      smd_3: {
        id: 'smd_3',
        speaker: 'narator',
        emotion: 'tenang',
        text: '[Baris Pembuka Kertas] "Kota Senja, pukul 02.14. Perihal: Pengajuan Pengunduran Diri — Kepada Yth. Kepala Divisi Operasional Menara Nusantara. Dengan hormat, melalui surat ini saya, Damar Pratama..."',
        nextNodeId: 'smd_4',
      },
      smd_4: {
        id: 'smd_4',
        speaker: 'narator',
        emotion: 'sedih',
        text: 'Namun tepat setelah kalimat formal itu, spasi barisnya melompat jauh. Kalimat berikutnya tidak lagi ditujukan kepada kantor—melainkan diketik Damar untuk dirinya sendiri dalam gelap ruang kerja:',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'smd_5',
      },
      smd_5: {
        id: 'smd_5',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: '[Ketikan Pukul 02.14] "Aku tahu besok pagi aku tidak akan berani menaruh kertas ini di meja Pak Hendra. Uang pangkal sekolah Kira sebentar lagi jatuh tempo, dan Nadia sudah cukup lelah mengurus rumah. Tapi kalau suatu hari nanti aku mati rasa... tolong ingatkan aku bahwa malam ini aku masih punya hati."',
        nextNodeId: 'smd_6',
      },
      smd_6: {
        id: 'smd_6',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: '[Paragraf Terakhir yang Memudar] "Aku tidak benci bekerja keras demi mereka. Aku hanya takut suatu malam aku pulang membawa gaji yang lebih besar, tapi orang yang membuka pintu rumah Jl. Melati bukan lagi laki-laki yang dulu bernyanyi untuk Nadia. Aku kangen bernapas tanpa merasa bersalah..."',
        conditionalNext: [
          {
            requiredFlag: 'read_nadia_diary_2020',
            nextNodeId: 'smd_6_echo_diary',
          },
          {
            requiredFlag: 'ch3_hendra_night_talk_done',
            nextNodeId: 'smd_6_echo_hendra',
          },
        ],
        nextNodeId: 'smd_7',
      },
      smd_6_echo_diary: {
        id: 'smd_6_echo_diary',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Cerita · Buku Harian Nadia & Laci Damar',
        text: 'Betapa ironisnya kami berdua... Di sudut kamar sana Nadia menyembunyikan doa subuhnya di buku kain bunga, sementara beberapa meter di sudut meja ini aku menyembunyikan tangisku di dasar laci. Dua orang yang saling mencintai setengah mati, namun sama-sama takut membebani.',
        nextNodeId: 'smd_7',
      },
      smd_6_echo_hendra: {
        id: 'smd_6_echo_hendra',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lobi Malam · Peringatan Pak Hendra',
        text: 'Kalimatku sebelas bulan lalu ini persis seperti masa depan yang tadi diperingatkan Pak Hendra di dekat jendela lobi malam. Syukurlah aku menemukan kertas ini kembali sebelum terlambat sepuluh tahun.',
        nextNodeId: 'smd_7',
      },
      smd_7: {
        id: 'smd_7',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Sebelas bulan kertas ini terkurung di dasar laci seperti rahasia memalukan. Padahal tidak ada yang memalukan dari seorang ayah yang mengakui dirinya lelah. Malam ini, apa yang ingin kulakukan pada lembar pukul dua pagi ini?',
        choices: [
          {
            id: 'smd_c_rewrite_vow',
            text: 'Ambil pena biru, coret baris "Pengunduran Diri", dan tulis ulang bagian bawahnya menjadi Janji Batas Hidup Sehat untuk kusimpan di Tas [I]',
            subtext: 'Mengubah pelarian menjadi keberanian menata hidup tanpa mengorbankan keluarga',
            nextNodeId: 'smd_end_rewrite',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 3,
              setFlags: ['found_midnight_draft', 'rewrote_midnight_draft'],
              phoneMessage: {
                id: 'msg_nadia_drawer_sound',
                sender: 'Nadia',
                preview: 'Mas, lagi beresin laci meja kerja ya? Jangan buka kerjaan kantor lagi lho—sini duduk dekat aku kalau sudah selesai ❤️',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_midnight_draft',
                title: 'Kalimat yang Ditulis Ulang dari Laci Pukul 02.14',
                body: 'Kutemukan kembali draf surat pukul dua pagi dari sebelas bulan silam di dasar laci meja kerja. Alih-alih lari atau terus membisu, kucoret judulnya dengan pena biru dan menulis janji baru: bekerja dengan terhormat tanpa pernah lagi menyerahkan malam milik Nadia dan Kira.',
                chapter: 1,
              },
              toast: 'Lembar Janji Pukul 02.14 yang Ditulis Ulang tersimpan di Tas Selempang [I]!',
            },
          },
          {
            id: 'smd_c_share_nadia',
            text: 'Masukkan lembar asli itu ke dalam Tas [I] tanpa mengubah satu huruf pun—aku ingin membukanya jujur di hadapan Nadia di meja makan nanti malam',
            subtext: 'Tidak menyisakan satu pun laci rahasia lagi di antara suami dan istri',
            nextNodeId: 'smd_end_share',
            effects: {
              kejujuranDiri: 4,
              kehadiranKeluarga: 2,
              setFlags: ['found_midnight_draft', 'shared_midnight_draft_nadia'],
              phoneMessage: {
                id: 'msg_nadia_drawer_honest',
                sender: 'Nadia',
                preview: 'Mas... barusan kamu berdiri lama banget di depan meja kerjamu. Kalau ada yang berat di pikiranmu, nanti cerita ke aku di meja makan ya ❤️',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_midnight_draft',
                title: 'Membawa Keluar Surat dari Dasar Laci',
                body: 'Sebelas bulan kusimpan draf pukul 02.14 itu di bawah tumpukan kabel karena malu terlihat lemah. Malam ini kubawa kertas itu keluar untuk kutunjukkan apa adanya kepada Nadia di meja makan.',
                chapter: 1,
              },
              toast: 'Draf Pukul 02.14 masuk ke Tas [I] — membuka cabang pengakuan baru di Meja Makan Bab 3!',
            },
          },
          {
            id: 'smd_c_forgive_tear',
            text: 'Sentuh kertas itu sambil memaafkan diriku yang dulu ketakutan, lalu lipat rapi di buku arsip selesai—aku tidak lagi butuh bersembunyi di laci gelap',
            subtext: 'Berdamai dengan masa terberat tahun lalu dengan kepala lebih ringan',
            nextNodeId: 'smd_end_forgive',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 1,
              setFlags: ['found_midnight_draft', 'released_midnight_draft'],
              journalEntry: {
                id: 'je_midnight_draft',
                title: 'Berdamai dengan Malam Pukul 02.14',
                body: 'Membaca ulang draf pukul dua pagi dari sebelas bulan lalu membuatku berterima kasih pada diriku sendiri karena telah bertahan sejauh ini. Kini saatnya melangkah keluar dari bayang-bayang ketakutan itu.',
                chapter: 1,
              },
              toast: 'Refleksi Draf Pukul 02.14 tersimpan di Jurnal Cerita.',
            },
          },
        ],
      },
      smd_end_rewrite: {
        id: 'smd_end_rewrite',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Goresan tinta biruku tegas di bagian bawah kertas: "Aku bekerja untuk menghidupi rumah ini, bukan untuk menghilang darinya." Kulipat lembar itu dan kusimpan dekat dompetku di tas selempang.',
        onEnter: { playSfx: 'page' },
      },
      smd_end_share: {
        id: 'smd_end_share',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Laci bawah meja kerjaku kini benar-benar kosong dari rahasia. Nanti malam di meja makan, Nadia berhak mengenal seluruh isi hati laki-laki yang menikahinya.',
        onEnter: { playSfx: 'chime' },
      },
      smd_end_forgive: {
        id: 'smd_end_forgive',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Kudorong kembali laci kayu itu hingga tertutup rapat. Udara di sudut ruang kerjaku mendadak terasa jauh lebih lega.',
        onEnter: { playSfx: 'switch' },
      },
    },
  },
};
