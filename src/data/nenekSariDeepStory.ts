import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Solo Karakter Pendukung — Nenek Sari (Taman Danau Senja):
 * "Rantang Empat Susun yang Tak Jadi Dikirim"
 * Lokasi: Samping Bangku Nenek Sari, Tepi Danau Senja (`[-69.15, 0, -18.35]`)
 *
 * Menyingkap alasan Nenek Sari duduk setiap sore di tepi danau bersama rantang kaleng bunga-bunga:
 * putra tunggalnya, Ardi, bekerja di menara perkantoran ibu kota dan selama tiga tahun selalu menunda pulang.
 */
export const NENEK_SARI_DEEP_DIALOGUES: Record<string, DialogueScript> = {
  story_nenek_sari_rantang: {
    id: 'story_nenek_sari_rantang',
    startNodeId: 'snsr_1',
    nodes: {
      snsr_1: {
        id: 'snsr_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di samping kaki bangku kayu tempat Nenek Sari biasa duduk menatap Danau Senja, tergeletak sebuah rantang kaleng empat susun bermotif bunga mawar jadul yang terbungkus serbet kotak-kotak bersih.',
        onEnter: { playSfx: 'interact' },
        nextNodeId: 'snsr_2',
      },
      snsr_2: {
        id: 'snsr_2',
        speaker: 'damar_batin',
        emotion: 'ragu',
        text: 'Dari sela tutup rantang paling atas masih tercium uap tipis aroma semur kentang, tahu cokelat, dan bawang goreng. Aneh... untuk siapa Nenek Sari membawa rantang penuh makanan ke pinggir danau seorang diri?',
        nextNodeId: 'snsr_3',
      },
      snsr_3: {
        id: 'snsr_3',
        speaker: 'nenek_sari',
        emotion: 'hangat',
        text: 'Eh, Nak Damar... kecium ya wangi semurnya? Duduk sini sebentar, Nak. Tangan Nenek sudah hafal takaran bumbu buat empat orang, jadi tiap hari Kamis tahu-tahu Nenek masak kebanyakan lagi.',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'snsr_4',
      },
      snsr_4: {
        id: 'snsr_4',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Kenapa setiap hari Kamis, Nek? Memangnya ada acara keluarga di rumah Nenek?',
        nextNodeId: 'snsr_5',
      },
      snsr_5: {
        id: 'snsr_5',
        speaker: 'nenek_sari',
        emotion: 'sedih',
        text: 'Dulu waktu putra tunggal Nenek—namanya Ardi, umurnya sepantaran kamu—baru mulai kerja, tiap Kamis sore dia selalu turun kereta di Stasiun Senja terus jemput Nenek di bangku danau ini buat makan semur bareng.',
        nextNodeId: 'snsr_6',
      },
      snsr_6: {
        id: 'snsr_6',
        speaker: 'nenek_sari',
        emotion: 'haru',
        text: 'Tapi sejak tiga tahun lalu jabatannya naik jadi kepala proyek gedung tinggi... tiap Kamis pagi dia cuma kirim pesan singkat dan transfer uang belanja dua kali lipat. Katanya: "Tunggu proyek kuartal ini beres ya, Bu, nanti Ardi pulang agak lama."',
        conditionalNext: [
          {
            requiredFlag: 'opened_mother_sewing_tin_2016',
            nextNodeId: 'snsr_6_echo_mother',
          },
          {
            requiredFlag: 'ch3_hendra_night_talk_done',
            nextNodeId: 'snsr_6_echo_hendra',
          },
        ],
        nextNodeId: 'snsr_7',
      },
      snsr_6_echo_mother: {
        id: 'snsr_6_echo_mother',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Cerita · Rindu pada Almarhumah Ibu',
        text: 'Dadaku langsung perih mendengar kalimat itu. Betapa banyak anak laki-laki seperti Ardi yang masih memiliki ibu yang memasakkan semur hangat, namun menukarnya dengan rapat kuartal—sementara aku bahkan hanya bisa memeluk kaleng jahit biru peninggalan Ibuku.',
        nextNodeId: 'snsr_7',
      },
      snsr_6_echo_hendra: {
        id: 'snsr_6_echo_hendra',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Cerita · Kalimat "Tunggu Proyek Ini Beres"',
        text: '"Tunggu proyek ini beres..." Kalimat yang persis sama yang diucapkan Pak Hendra lima belas tahun lalu, dan kalimat yang nyaris kuucapkan kepada Nadia.',
        nextNodeId: 'snsr_7',
      },
      snsr_7: {
        id: 'snsr_7',
        speaker: 'nenek_sari',
        emotion: 'sedih',
        text: 'Uang kirimannya Nenek simpan utuh di amplop lemari, Nak Damar. Nenek nggak butuh kulkas baru atau kasur mahal. Umur Nenek sudah tujuh puluh dua... Nenek cuma kangen dengar suara sendok Ardi beradu sama piring di meja makan Nenek.',
        nextNodeId: 'snsr_8',
      },
      snsr_8: {
        id: 'snsr_8',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Angin danau menggoyang ujung kerudung Nenek Sari. Di hadapanku duduk potret paling nyata dari apa yang dirasakan orang-orang di rumah setiap kali kita mengganti kehadiran dengan uang transferan.',
        choices: [
          {
            id: 'snsr_c_record_voice',
            text: '"Nek... boleh saya bantu rekamkan pesan suara hangat dari ponsel Nenek buat Mas Ardi? Bukan untuk menyalahkannya, tapi supaya dia dengar betapa Nenek merindukan suaranya."',
            subtext: 'Membantu Nenek Sari menjembatani rindu kepada putranya dengan lembut',
            nextNodeId: 'snsr_end_voice',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 3,
              setFlags: ['heard_nenek_sari_rantang', 'helped_sari_voice_note'],
              journalEntry: {
                id: 'je_nenek_sari_rantang',
                title: 'Rantang Empat Susun Hari Kamis (Nenek Sari)',
                body: 'Setiap hari Kamis, Nenek Sari masih memasak semur tahu-kentang empat susun untuk putranya, Ardi, yang tiga tahun tenggelam dalam jabatan kantornya. Aku membantunya mengirim pesan suara lembut kepada Ardi—sekaligus berjanji tidak akan membiarkan keluargaku hanya memeluk uang kirimanku.',
                chapter: 1,
              },
              toast: 'Pesan suara Nenek Sari terkirim — kisahnya tersimpan di Jurnal & Epilog!',
            },
          },
          {
            id: 'snsr_c_eat_together',
            text: 'Duduk di bangku sebelah Nenek Sari dan temani beliau menyantap sesendok semur hangat itu sambil mendengarkan cerita masa kecil Mas Ardi',
            subtext: 'Memberikan waktu dan telinga yang tulus agar rantang Nenek Sari tidak dingin sia-sia',
            nextNodeId: 'snsr_end_eat',
            effects: {
              kehadiranKeluarga: 4,
              kejujuranDiri: 2,
              setFlags: ['heard_nenek_sari_rantang', 'shared_semur_with_sari'],
              journalEntry: {
                id: 'je_nenek_sari_rantang',
                title: 'Semur Hangat di Bangku Tepi Danau',
                body: 'Aku duduk menemani Nenek Sari mencicipi semur tahu-kentang dari rantang mawar empat susunnya. Senyum bahagia di matanya saat mendengar bunyi sendokku membuatku bertekad pulang tepat waktu ke meja makanku sendiri.',
                chapter: 1,
              },
              toast: 'Momen hangat bersama Nenek Sari tersimpan di Jurnal Cerita!',
            },
          },
        ],
      },
      snsr_end_voice: {
        id: 'snsr_end_voice',
        speaker: 'nenek_sari',
        emotion: 'haru',
        text: 'Nenek Sari berbicara pelan ke dekat ponselnya dengan mata berbinar: "Ardi sayang, semur kentangnya Ibu makan di pinggir danau ditemani anak muda baik ya. Jangan lupa makan malam, Nak—kapan pun kamu senggang, pintu rumah selalu buka." Ia menepuk punggung tangan Damar. "Pulanglah ke anak istrimu nanti malam ya, Nak Damar. Jangan tunggu hari Kamis tahun depan."',
        onEnter: { playSfx: 'phone' },
      },
      snsr_end_eat: {
        id: 'snsr_end_eat',
        speaker: 'nenek_sari',
        emotion: 'ceria',
        text: 'Wajah Nenek Sari langsung cerah melihat Damar melahap semur buatannya. "Nah, enak kan kalau dimakan hangat-hangat! Terima kasih sudah mengobati rindu Nenek sore ini, Nak. Nanti malam giliran masakan istrimu di rumah yang kamu habiskan ya!"',
        onEnter: { playSfx: 'chime' },
      },
    },
  },
};
