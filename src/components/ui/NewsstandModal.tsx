import React, { useState } from 'react';
import { Newspaper, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { STATION_NEWS_ARTICLES, STATION_NEWS_EDITION } from '../../data/stationNewsData';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

const TIME_EDITION_LABEL = {
  morning: 'Edisi Pagi',
  sunset: 'Edisi Sore',
  rain_dusk: 'Edisi Sore Berhujan',
  night: 'Edisi Malam',
};

/**
 * Pembaca Koran Broadsheet Klasik ("Harian Warta Senja") di Kios Stasiun Kereta Tua Senja.
 */
export const NewsstandModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isNewsstandOpen);
  const setOpen = useGameStore((s) => s.setNewsstandOpen);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const [selectedId, setSelectedId] = useState(STATION_NEWS_ARTICLES[0].id);

  if (!isOpen) return null;

  const activeArticle =
    STATION_NEWS_ARTICLES.find((a) => a.id === selectedId) ?? STATION_NEWS_ARTICLES[0];

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/84 p-4 backdrop-blur-md"
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[94dvh] sm:max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-2 border-[#c8bc9e] bg-[#f4ede0] text-[#241e18] shadow-2xl animate-fadeIn"
        >
          {/* Kepala Koran Klasik (Masthead Broadsheet) */}
          <div className="shrink-0 border-b-2 border-[#2b241d] bg-[#ede4d1] px-4 py-2.5 sm:px-6 sm:py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2b241d]/25 bg-[#1b4332] text-[#fefae0]">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1c1712]">
                    {STATION_NEWS_EDITION.paperName}
                  </h2>
                  <p className="text-[11px] font-medium text-[#5c5042]">
                    {STATION_NEWS_EDITION.tagline}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-[#5c5042] hover:bg-black/10 hover:text-[#1c1712]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#2b241d]/25 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5c5042]">
              <span>Stasiun Kereta Tua Senja · {TIME_EDITION_LABEL[timeOfDay]}</span>
              <span>Harga Eceran: {STATION_NEWS_EDITION.priceLabel}</span>
            </div>
          </div>

          {/* Isi Broadsheet: Daftar Kolom Kiri + Artikel Utama Kanan */}
          <div className="grid min-h-0 flex-1 grid-cols-12 overflow-hidden">
            {/* Sidebar Kolom Rubrik */}
            <div className="col-span-4 min-h-0 overflow-y-auto subtle-scroll border-r border-[#2b241d]/15 bg-[#efe7d6] p-3 sm:p-4">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b5d4d]">
                Daftar Berita Hari Ini
              </p>
              <div className="space-y-2">
                {STATION_NEWS_ARTICLES.map((art) => {
                  const selected = art.id === activeArticle.id;
                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => {
                        sfxEngine.play('page');
                        setSelectedId(art.id);
                      }}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        selected
                          ? 'border-[#1b4332] bg-[#faf6ec] shadow-sm'
                          : 'border-[#c8bc9e]/60 bg-[#f6efe1]/60 hover:bg-[#faf6ec]'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b4332]">
                        {art.section}
                      </span>
                      <p className="mt-1 font-serif text-sm font-semibold leading-snug text-[#1f1a15]">
                        {art.headline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Area Baca Artikel Broadsheet */}
            <div className="col-span-8 min-h-0 overflow-y-auto subtle-scroll p-4 sm:p-6 md:p-7">
              <span className="inline-block rounded bg-[#1b4332] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#fefae0]">
                {activeArticle.section}
              </span>
              <h3 className="mt-2.5 font-serif text-2xl font-bold leading-snug text-[#1a1510]">
                {activeArticle.headline}
              </h3>
              <p className="mt-1 text-xs font-medium text-[#6b5d4d]">{activeArticle.byline}</p>

              <p className="mt-4 border-y border-[#2b241d]/20 py-3 font-serif italic text-sm text-[#3d3328]">
                {activeArticle.summary}
              </p>

              <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-[#2c251e]">
                {activeArticle.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-[#c8bc9e] bg-[#ebe2ce]/75 px-4 py-3 text-xs italic text-[#4d4134]">
                {activeArticle.closingNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
