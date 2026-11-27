import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Kedalaman Karakter Pendukung Utama:
 * "Penjaga Lagu Orang Lain" — Kisah Busur Cello 2014 & Alasan Mas Bagas Menjaga Gitar Damar
 * Lokasi: Sudut Belakang Toko Musik Antik "Nada Lama" (`[-22.35, 0.08, -26.55]`)
 *
 * Menyingkap luka masa lalu Mas Bagas bersama almarhum adiknya, Rama (pemain cello, 2014),
 * yang menjelaskan mengapa selama enam tahun Mas Bagas menolak menjual gitar mahoni Damar.
 */
export const BAGAS_ARCHIVE_DIALOGUES: Record<string, DialogueScript> = {
  story_bagas_penjaga_lagu: {
    id: 'story_bagas_penjaga_lagu',
    startNodeId: 'sbpl_1',
    flashback: {
      yearLabel: 'OKTOBER 2014 & HARI INI · NADA LAMA',
      title: 'Penjaga Lagu Orang Lain',
      locationLabel: 'Sudut Belakang Toko Musik Antik "Nada Lama"',
      mood: 'rain_melancholy',
      epigraph: 'Seseorang menjaga mimpimu rapat-rapat bukan karena ia berlebih, melainkan karena ia tahu persis perihnya kehilangan sesuatu yang tak bisa ditebus kembali.',
    },
    nodes: {
      sbpl_1: {
        id: 'sbpl_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di sudut terdalam Toko Musik "Nada Lama", tepat di sebelah penyangga koper gitar mahoni berlabel "TITIPAN DAMAR", tergantung sebuah kotak beludru tua terbuka yang hanya berisi sebatang busur cello kayu pernambuco tanpa instrumennya.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'sbpl_2',
      },
      sbpl_2: {
        id: 'sbpl_2',
        speaker: 'damar_batin',
        emotion: 'ragu',
        text: 'Di bingkai bawahnya terpasang pelat kuningan kecil yang selalu berkilap bersih: "Rama Pratista · 1993–2014". Bertahun-tahun aku mampir ke toko ini, aku tidak pernah berani menanyakan mengapa busur itu tidak punya cello.',
        nextNodeId: 'sbpl_3',
      },
      sbpl_3: {
        id: 'sbpl_3',
        speaker: 'mas_bagas',
        emotion: 'tenang',
        text: 'Mas Bagas menyibak tirai ruang servis senar sambil membawa secangkir teh tawar hangat. "Itu busur milik adik bungsuku, Mar. Namanya Rama. Dulu dialah yang mengusulkan nama toko ini \'Nada Lama\'."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'sbpl_4',
      },
      sbpl_4: {
        id: 'sbpl_4',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Adik kandung Mas Bagas...? Maaf, Gas, selama kita kenal aku nggak pernah tahu kamu dulu punya adik pemain cello.',
        nextNodeId: 'sbpl_5',
      },
      sbpl_5: {
        id: 'sbpl_5',
        speaker: 'mas_bagas',
        emotion: 'sedih',
        text: 'Jarang aku ceritakan, Mar, soalnya tiap ingat rasanya dada masih suka bolong. Oktober 2014, waktu toko ini baru setahun buka, Rama masuk ICU rumah sakit kota karena komplikasi demam berdarah. Malam ketiga, dokter bilang kami harus menebus obat penyangga jantung sebelum subuh.',
        nextNodeId: 'sbpl_6',
      },
      sbpl_6: {
        id: 'sbpl_6',
        speaker: 'mas_bagas',
        emotion: 'haru',
        text: 'Tabunganku habis. Tengah malam hujan deras, kulepas cello kayu mapel kesayangan Rama ke seorang kolektor dari luar pulau dengan separuh harga. Cuma busurnya yang tak sengaja tertinggal di atas meja bengkel.',
        nextNodeId: 'sbpl_7',
      },
      sbpl_7: {
        id: 'sbpl_7',
        speaker: 'mas_bagas',
        emotion: 'sedih',
        text: 'Tiga hari sesudahnya Rama berpulang, Mar. Dua tahun aku nabung mati-matian buat menebus balik cello itu supaya bisa kupajang utuh menemani busurnya... tapi waktu kucari, kolektornya sudah pindah ke luar negeri. Sampai hari ini, aku tidak pernah mendengar suara kayu cello itu lagi.',
        conditionalNext: [
          {
            requiredFlag: 'flashback_2020_done',
            nextNodeId: 'sbpl_7_echo2020',
          },
          {
            requiredFlag: 'ch3_bima_night_talk_done',
            nextNodeId: 'sbpl_7_echo_bima',
          },
        ],
        nextNodeId: 'sbpl_8',
      },
      sbpl_7_echo2020: {
        id: 'sbpl_7_echo2020',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Memori · Malam Hujan 08 Agustus 2020',
        text: 'Napasku terhenti. Seketika malam hujan Agustus 2020 berputar kembali di kepalaku—saat Mas Bagas menolak menulis kata "JUAL PUTUS" di kuitansiku dan justru menempelkan stiker kertas "TITIPAN DAMAR".',
        nextNodeId: 'sbpl_8',
      },
      sbpl_7_echo_bima: {
        id: 'sbpl_7_echo_bima',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Persahabatan · Bima & Mas Bagas',
        text: 'Ya Tuhan... di Kedai Kopi Sudut ada Bima yang menjaga panggungku, dan di toko kecil ini ada Mas Bagas yang menjaga gitarku karena luka kehilangan adiknya sendiri.',
        nextNodeId: 'sbpl_8',
      },
      sbpl_8: {
        id: 'sbpl_8',
        speaker: 'mas_bagas',
        emotion: 'hangat',
        text: 'Makanya, Mar... waktu tanggal delapan Agustus enam tahun lalu kamu basah kuyup masuk kemari sambil memeluk gitar mahoni ini demi biaya persalinan Nadia, aku seperti melihat diriku sendiri tahun 2014. Malam itu di depan busur Rama aku bersumpah: selama aku masih bernapas, tidak boleh ada ayah yang kehilangan instrumen jiwanya selamanya di toko ini.',
        nextNodeId: 'sbpl_9',
      },
      sbpl_9: {
        id: 'sbpl_9',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Enam tahun Mas Bagas menolak belasan penawar yang ingin membeli gitar mahoniku—bukan karena kebetulan, melainkan karena ia sedang menyembuhkan lukanya sendiri dengan menyelamatkan masa depanku bersama Nadia dan Kira.',
        choices: [
          {
            id: 'sbpl_c_dedicate_rama',
            text: '"Mas Bagas... izinkan aku menyelipkan satu bait penghormatan untuk almarhum Rama saat nanti kunyanyikan lagu \'Pulang\'. Suara cello Rama hidup di setiap senar yang Mas Bagas jaga."',
            subtext: 'Menghormati kenangan Rama & menyembuhkan luka sebelas tahun Mas Bagas',
            nextNodeId: 'sbpl_end_dedicate',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 3,
              setFlags: ['heard_bagas_rama_story', 'dedicated_song_to_rama'],
              phoneMessage: {
                id: 'msg_bagas_rama_thanks',
                sender: 'Mas Bagas (Nada Lama)',
                preview: 'Mar... sehabis kamu keluar tadi, aku duduk lama di depan busur Rama sambil senyum. Terima kasih sudah bikin nama adikku hidup lagi di lagumu.',
                timeLabel: 'Baru saja',
                threadId: 'bagas',
              },
              journalEntry: {
                id: 'je_bagas_rama_2014',
                title: 'Busur Cello Tanpa Instrumen (Rama · 2014)',
                body: 'Akhirnya kutahu alasan Mas Bagas menjaga gitar mahoniku selama enam tahun tanpa pernah menjualnya. Pada Oktober 2014, ia pernah menjual cello almarhum adiknya, Rama, demi biaya ICU dan tak pernah bisa menebusnya kembali. Aku berjanji mendedikasikan lagu "Pulang" agar kenangan Rama tetap bernyanyi.',
                chapter: 1,
              },
              toast: 'Kisah Rama & Mas Bagas terbuka di Pesan Suara HP [H] & Jurnal!',
            },
          },
          {
            id: 'sbpl_c_family_promise',
            text: 'Sentuh koper gitar mahoni itu dengan takzim: "Sumpahmu malam Agustus 2020 itu nggak sia-sia, Gas. Aku janji akan datang menjemput gitar ini bersama Nadia dan putri kecil yang dulu ikut kau selamatkan."',
            subtext: 'Menjanjikan pertemuan mengharukan antara Mas Bagas, Nadia, dan Kira',
            nextNodeId: 'sbpl_end_family',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 2,
              setFlags: ['heard_bagas_rama_story', 'vowed_bring_family_to_bagas'],
              phoneMessage: {
                id: 'msg_bagas_family_wait',
                sender: 'Mas Bagas (Nada Lama)',
                preview: 'Aku tunggu kedatangan kamu bareng Nadia dan Kira ya, Mar! Nanti kusiapkan bangku kecil dekat turntable buat putri kamu.',
                timeLabel: 'Baru saja',
                threadId: 'bagas',
              },
              journalEntry: {
                id: 'je_bagas_rama_2014',
                title: 'Penjaga Lagu di Sudut Nada Lama',
                body: 'Di balik stiker "TITIPAN DAMAR", ada sumpah sunyi Mas Bagas di depan busur cello almarhum adiknya tahun 2014. Aku berjanji mengajak Nadia dan Kira ke toko ini untuk menjemput gitar itu pulang bersama.',
                chapter: 1,
              },
              toast: 'Janji kepada Mas Bagas tercatat di Jurnal & HP [H]!',
            },
          },
          {
            id: 'sbpl_c_quiet_embrace',
            text: 'Menunduk hening di depan plakat kuningan Rama, lalu merangkul bahu Mas Bagas erat sebagai sesama keluarga yang pernah bertaruh segalanya di tengah hujan',
            subtext: 'Persaudaraan tanpa kata di antara dua penjaga keluarga',
            nextNodeId: 'sbpl_end_quiet',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              setFlags: ['heard_bagas_rama_story'],
              journalEntry: {
                id: 'je_bagas_rama_2014',
                title: 'Plakat Kuningan di Sebelah Koper Mahoni',
                body: 'Mas Bagas menceritakan kisah almarhum adiknya, Rama, dan cello yang terjual pada malam hujan Oktober 2014. Ternyata kebaikan paling tulus sering lahir dari orang yang pernah merasakan kehilangan paling dalam.',
                chapter: 1,
              },
              toast: 'Kenangan mendalam bersama Mas Bagas tersimpan di Jurnal.',
            },
          },
        ],
      },
      sbpl_end_dedicate: {
        id: 'sbpl_end_dedicate',
        speaker: 'mas_bagas',
        emotion: 'haru',
        text: 'Mata Mas Bagas berkaca-kaca di balik lampu kuning toko. "Kalau Rama dengar dari atas sana ada musisi yang mendedikasikan lagu keluarga buat dia... pasti dia senyum paling lebar, Mar. Terima kasih banyak ya."',
        onEnter: { playSfx: 'guitar' },
      },
      sbpl_end_family: {
        id: 'sbpl_end_family',
        speaker: 'mas_bagas',
        emotion: 'hangat',
        text: '"Nah, itu janji yang paling kutunggu enam tahun ini!" Mas Bagas menepuk tutup koper mahoni itu pelan. "Pulanglah dengan hati tenang, Mar—gitarmu aman di samping Rama sampai kalian datang."',
        onEnter: { playSfx: 'chime' },
      },
      sbpl_end_quiet: {
        id: 'sbpl_end_quiet',
        speaker: 'mas_bagas',
        emotion: 'tenang',
        text: 'Mas Bagas menepuk balik punggung Damar dua kali dengan hangat. Tidak ada lagi kata yang diperlukan di antara deretan kayu gitar tua sore itu.',
        onEnter: { playSfx: 'chime' },
      },
    },
  },
};
