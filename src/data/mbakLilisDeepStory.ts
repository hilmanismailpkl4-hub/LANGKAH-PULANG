import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Solo Pengorbanan Kakak-Beradik — Mbak Lilis (Kios 24 Jam Harmoni):
 * "Struk Kasir Pukul 03.00 & Jubah Pahlawan di Balik Kertas Termal"
 * Lokasi: Pojok Meja Kasir Kios 24 Jam Harmoni (`[26.25, 0.08, 21.85]`)
 *
 * Menyingkap lima lembar kertas struk kasir bekas yang digambari komik pensil oleh adik Mbak Lilis,
 * Fajar (10 tahun), yang diam-diam mengkhawatirkan kakaknya bekerja shift dini hari di bawah lampu neon.
 */
export const MBAK_LILIS_DEEP_DIALOGUES: Record<string, DialogueScript> = {
  story_mbak_lilis_receipt_sketches: {
    id: 'story_mbak_lilis_receipt_sketches',
    startNodeId: 'smlr_1',
    nodes: {
      smlr_1: {
        id: 'smlr_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di sudut meja kasir Kios 24 Jam Harmoni dekat mesin pencetak nota, terdapat lima lembar potongan kertas struk termal panjang yang diratakan rapi dan dijepit klip besi hitam.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'smlr_2',
      },
      smlr_2: {
        id: 'smlr_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Di balik sisi putih struk bekas itu tergambar komik pensil mungil yang halus sekali garisnya: seorang kakak perempuan berseragam kasir minimarket mengenakan jubah pahlawan super, merentangkan tangannya menahan hujan deras agar adik kecilnya yang menggendong tas sekolah tetap kering.',
        nextNodeId: 'smlr_3',
      },
      smlr_3: {
        id: 'smlr_3',
        speaker: 'mbak_lilis',
        emotion: 'hangat',
        text: 'Mbak Lilis tersenyum malu sambil merapikan kerah seragam kiosnya. "Itu ulah Fajar, adik bungsu saya yang umur sepuluh tahun, Mas Damar. Sebelum dapat buku sketsa tebal dari Pak Darman, dia suka diam-diam ngumpulin struk batal cetak dari saku celemek saya tiap pagi."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'smlr_4',
      },
      smlr_4: {
        id: 'smlr_4',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Garis gambarnya hidup sekali, Mbak Lilis. Adik Mbak sayang banget kelihatannya sama kakaknya.',
        nextNodeId: 'smlr_5',
      },
      smlr_5: {
        id: 'smlr_5',
        speaker: 'mbak_lilis',
        emotion: 'sedih',
        text: 'Tiga tahun lalu waktu Bapak sama Ibu berpulang dalam kecelakaan bus, tinggal kami berdua di kontrakan, Mas. Saya tunda kuliah saya terus ambil jatah shift malam terus di Harmoni supaya uang pangkal SMP Fajar nanti aman.',
        nextNodeId: 'smlr_6',
      },
      smlr_6: {
        id: 'smlr_6',
        speaker: 'mbak_lilis',
        emotion: 'haru',
        text: 'Tapi minggu lalu jam tiga subuh waktu kios sepi, saya balik lembar struk kelima ini... dan ada tulisan pensil Fajar di paling bawah: "Mbak Lilis jangan ambil shift malam melulu ya. Fajar nggak pengin sepatu baru—Fajar takut Mbak Lilis sakit sendirian di bawah lampu neon."',
        conditionalNext: [
          {
            requiredFlag: 'found_kira_secret_drawings',
            nextNodeId: 'smlr_6_echo_kira',
          },
          {
            requiredFlag: 'found_midnight_draft',
            nextNodeId: 'smlr_6_echo_draft',
          },
        ],
        nextNodeId: 'smlr_7',
      },
      smlr_6_echo_kira: {
        id: 'smlr_6_echo_kira',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Cerita · Krayon Kira & Pensil Fajar',
        text: 'Kira di bawah bantal bintangnya, Fajar di balik kertas struk kasir kakaknya... betapa jernihnya anak-anak membaca kelelahan orang yang mencintai mereka.',
        nextNodeId: 'smlr_7',
      },
      smlr_6_echo_draft: {
        id: 'smlr_6_echo_draft',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Laci Pukul 02.14 · Kesunyian Dini Hari',
        text: 'Pukul tiga pagi di bawah lampu neon... aku hafal betul dinginnya jam-jam sunyi ketika seluruh kota tidur sementara kita memaksa mata tetap terbuka demi masa depan keluarga.',
        nextNodeId: 'smlr_7',
      },
      smlr_7: {
        id: 'smlr_7',
        speaker: 'mbak_lilis',
        emotion: 'hangat',
        text: 'Saya menangis di belakang rak minuman subuh itu, Mas Damar. Kita yang cari nafkah kadang keras kepala sekali—kita kira bukti sayang itu cuma soal bayar tagihan tepat waktu, sampai lupa kalau orang di rumah paling takut kehilangan kita.',
        choices: [
          {
            id: 'smlr_c_preserve_sleeve',
            text: 'Ambilkan plastik map mika bening dari rak alat tulis kios agar kelima komik struk Fajar tidak luntur terkena panas mesin kasir—dan semangati Lilis libur shift malam!',
            subtext: 'Menjaga karya kecil Fajar tetap abadi & mendukung Mbak Lilis beristirahat',
            nextNodeId: 'smlr_end_sleeve',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 3,
              setFlags: ['heard_mbak_lilis_receipt_story', 'preserved_fajar_receipt_art'],
              journalEntry: {
                id: 'je_mbak_lilis_receipt',
                title: 'Jubah Pahlawan di Balik Struk Kasir Pukul 03.00',
                body: 'Di meja kasir Kios Harmoni, kubaca pesan pensil adik Mbak Lilis di balik kertas struk termal: ia tidak menginginkan sepatu baru, ia hanya takut kakaknya jatuh sakit sendirian di bawah lampu neon. Aku membantu melapisi sketsa itu dengan mika bening agar tak pernah pudar.',
                chapter: 1,
              },
              toast: 'Komik struk Fajar tersimpan rapi dalam mika — tercatat di Jurnal & Epilog!',
            },
          },
          {
            id: 'smlr_c_invite_sketch_park',
            text: '"Gambar Fajar tulus sekali, Mbak Lilis. Kapan-kapan waktu Mbak libur pagi, ajak Fajar menggambar di tepi Danau Senja bareng putri saya Kira ya!"',
            subtext: 'Menghubungkan kehangatan keluarga kecil di Kota Senja',
            nextNodeId: 'smlr_end_park',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 2,
              setFlags: ['heard_mbak_lilis_receipt_story'],
              journalEntry: {
                id: 'je_mbak_lilis_receipt',
                title: 'Pesan Kecil dari Kantong Celemek (Mbak Lilis)',
                body: 'Mbak Lilis memperlihatkan komik pahlawan super yang digambar adiknya di balik kertas struk kasir. Sebuah pengingat lembut bahwa keluarga lebih membutuhkan kita sehat dan pulang daripada sekadar barang baru.',
                chapter: 1,
              },
              toast: 'Kisah mengharukan Mbak Lilis & Fajar tersimpan di Jurnal!',
            },
          },
        ],
      },
      smlr_end_sleeve: {
        id: 'smlr_end_sleeve',
        speaker: 'mbak_lilis',
        emotion: 'ceria',
        text: 'Mata Mbak Lilis berbinar saat menyelipkan kelima struk termal itu ke dalam mika pelindung bening. "Iya Mas, bener! Kertas struk kalau kena panas suka hilang tintanya—sekarang gambar Fajar aman selamanya! Minggu depan saya sudah tukar jadwal jadi shift pagi. Makasih banyak ya, Mas Damar!"',
        onEnter: { playSfx: 'chime' },
      },
      smlr_end_park: {
        id: 'smlr_end_park',
        speaker: 'mbak_lilis',
        emotion: 'ceria',
        text: '"Wah, Fajar pasti girang banget punya teman menggambar di danau!" Mbak Lilis tersenyum hangat. "Hati-hati pulang ke Jl. Melatinya ya, Mas Damar—salam buat Mbak Nadia dan adik Kira!"',
        onEnter: { playSfx: 'chime' },
      },
    },
  },
};
