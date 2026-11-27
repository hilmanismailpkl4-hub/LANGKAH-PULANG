import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Solo Karakter Tetangga — Bu Wati (Perumahan Melati):
 * "Lampu Teras Tiga Puluh Tahun untuk Pak Rahmat"
 * Lokasi: Kursi Rotan Teras Rumah Bu Wati, Jl. Melati (`[25.35, 0, 62.15]`)
 *
 * Menyingkap alasan Bu Wati tidak pernah membiarkan lampu teras rumahnya padam barang semalam pun,
 * serta bagaimana ia setiap malam melihat Nadia menyalakan lampu teras rumah No. 14 menunggu Damar.
 */
export const BU_WATI_DEEP_DIALOGUES: Record<string, DialogueScript> = {
  story_bu_wati_porch_light: {
    id: 'story_bu_wati_porch_light',
    startNodeId: 'sbwp_1',
    nodes: {
      sbwp_1: {
        id: 'sbwp_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di teras teduh rumah Bu Wati, berjajar dua kursi rotan bundar lengkap dengan sepasang tatakan gelas rajut putih yang bersih dari debu. Di sandaran kursi sebelah kanan tergantung sebuah topi pet biru tua bersulam benang perak pudar: "PO SENJA UTAMA".',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'sbwp_2',
      },
      sbwp_2: {
        id: 'sbwp_2',
        speaker: 'bu_wati',
        emotion: 'hangat',
        text: 'Mari duduk sebentar, Nak Damar. Itu topi dinas almarhum Bapak—Pak Rahmat. Tiga puluh tahun beliau jadi pengemudi bus malam antarkota, baru belok masuk Gang Melati kalau jam dinding sudah bunyi sebelas kali.',
        nextNodeId: 'sbwp_3',
      },
      sbwp_3: {
        id: 'sbwp_3',
        speaker: 'damar',
        emotion: 'tenang',
        text: 'Pantas tadi waktu sakelar lampu teras Ibu rusak menjelang magrib, Ibu kelihatan cemas sekali ya, Bu?',
        nextNodeId: 'sbwp_4',
      },
      sbwp_4: {
        id: 'sbwp_4',
        speaker: 'bu_wati',
        emotion: 'sedih',
        text: 'Senyum ramah Bu Wati meredup pelan, matanya menatap bohlam kuning di atas kepalanya. "Iya, Nak... soalnya Ibu punya satu penyesalan yang nggak bisa Ibu ulang seumur hidup."',
        nextNodeId: 'sbwp_5',
      },
      sbwp_5: {
        id: 'sbwp_5',
        speaker: 'bu_wati',
        emotion: 'haru',
        text: 'Dua belas tahun lalu waktu hujan bulan Februari, sebelum Bapak berangkat narik bus sore, kami sempat cekcok kecil soal uang genteng bocor. Karena masih dongkol, waktu bohlam teras putus malam itu sengaja nggak Ibu ganti. Ibu matikan semua lampu depan, terus tidur membelakangi pintu.',
        nextNodeId: 'sbwp_6',
      },
      sbwp_6: {
        id: 'sbwp_6',
        speaker: 'bu_wati',
        emotion: 'sedih',
        text: 'Jam dua subuh telepon berdering dari poliklinik terminal, Nak Damar. Bapak kena serangan jantung tepat sesudah menurunkan penumpang terakhirnya dengan selamat. Beliau berpulang malam itu juga... tanpa pernah sempat melihat lampu teras rumahnya dinyalakan lagi oleh Ibu.',
        conditionalNext: [
          {
            requiredFlag: 'flashback_melati_2019_done',
            nextNodeId: 'sbwp_6_echo2019',
          },
          {
            requiredFlag: 'flashback_dinner_done',
            nextNodeId: 'sbwp_6_echo_dinner',
          },
        ],
        nextNodeId: 'sbwp_7',
      },
      sbwp_6_echo2019: {
        id: 'sbwp_6_echo2019',
        speaker: 'bu_wati',
        emotion: 'hangat',
        echoTag: 'Ingatan Bu Wati · Malam Pindahan Kalian 12 Nov 2019',
        text: 'Ibu masih ingat betul malam kalian berdua baru pindah ke No. 14 tahun 2019 cuma berbekal dua kardus buku dan bohlam lima watt, Nak. Tawa kalian waktu itu terdengar sampai pagar Ibu—persis Ibu sama Pak Rahmat waktu masih muda.',
        nextNodeId: 'sbwp_7',
      },
      sbwp_6_echo_dinner: {
        id: 'sbwp_6_echo_dinner',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Memori · Malam Pukul 22.15 di Rumah Sendiri',
        text: 'Dadaku terasa tercekat. Enam bulan lalu waktu kami berdiam-diaman di meja makan pukul sepuluh malam, Nadia tetap tidak pernah mematikan lampu teras untukku.',
        nextNodeId: 'sbwp_7',
      },
      sbwp_7: {
        id: 'sbwp_7',
        speaker: 'bu_wati',
        emotion: 'haru',
        text: 'Tiap jam delapan malam kalau Ibu mengunci pagar, Ibu selalu menoleh ke ujung barat jalan ini, Nak Damar. Ibu lihat Mbak Nadia keluar menyalakan lampu teras rumah No. 14, menyentuh daun melatinya sebentar, lalu menatap ujung jalan nunggu sorot lampu motormu. Selama masih ada orang yang menyalakan lampu teras buatmu... jangan pernah anggap sepele jalan pulangmu ya, Nak.',
        choices: [
          {
            id: 'sbwp_c_vow_nadia',
            text: '"Terima kasih banyak sudah mengingatkan saya, Bu Wati. Malam ini saya janji pulang sebelum lampu teras yang dinyalakan Nadia terasa sepi lagi."',
            subtext: 'Menghormati penantian Nadia dari kacamata tetangga yang paling peduli',
            nextNodeId: 'sbwp_end_vow',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 3,
              setFlags: ['heard_bu_wati_rahmat_story', 'vowed_porch_light_wati'],
              journalEntry: {
                id: 'je_bu_wati_rahmat',
                title: 'Lampu Teras Tiga Puluh Tahun untuk Pak Rahmat',
                body: 'Di teras rumahnya, Bu Wati menceritakan penyesalannya dua belas tahun silam saat membiarkan lampu teras padam pada malam terakhir suaminya bertugas menarik bus. Pesannya meresap sampai ke tulangku: jangan pernah menyia-nyiakan perempuan yang setiap senja masih menyalakan lampu teras untukku di No. 14.',
                chapter: 1,
              },
              toast: 'Pesan mendalam Bu Wati tersimpan di Jurnal & Epilog!',
            },
          },
          {
            id: 'sbwp_c_sit_tea',
            text: 'Duduk sebentar di kursi rotan sebelah topi Pak Rahmat dan temani Bu Wati menyeruput teh serai hangat sambil mendengarkan kenangan rute bus suaminya',
            subtext: 'Menghangatkan teras Bu Wati sore ini sebagai tetangga yang hadir',
            nextNodeId: 'sbwp_end_tea',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 2,
              setFlags: ['heard_bu_wati_rahmat_story', 'sat_rattan_chair_wati'],
              journalEntry: {
                id: 'je_bu_wati_rahmat',
                title: 'Topi Sopir Bus di Kursi Rotan Teras',
                body: 'Aku duduk menemani Bu Wati di sebelah topi dinas almarhum Pak Rahmat. Ternyata cahaya kuning kecil di tiap beranda Jl. Melati menyimpan begitu banyak doa bagi orang-orang yang sedang di perjalanan.',
                chapter: 1,
              },
              toast: 'Kenangan hangat di teras Bu Wati tersimpan di Jurnal!',
            },
          },
        ],
      },
      sbwp_end_vow: {
        id: 'sbwp_end_vow',
        speaker: 'bu_wati',
        emotion: 'hangat',
        text: 'Bu Wati mengusap sudut matanya dengan ujung lengan baju kurungnya lalu tersenyum lega. "Alhamdulillah... sana lanjutkan langkahmu, Nak Damar. Doa Ibu selalu menyertai keluarga kecil kalian di nomor empat belas."',
        onEnter: { playSfx: 'chime' },
      },
      sbwp_end_tea: {
        id: 'sbwp_end_tea',
        speaker: 'bu_wati',
        emotion: 'ceria',
        text: 'Aroma serai dan pandan mengepul hangat di antara dua kursi rotan itu. "Aduh, senang betul hati Ibu ada teman mengobrol di bawah lampu teras ini. Salam sayang buat Mbak Nadia dan si cantik Kira ya, Nak!"',
        onEnter: { playSfx: 'coffee' },
      },
    },
  },
};
