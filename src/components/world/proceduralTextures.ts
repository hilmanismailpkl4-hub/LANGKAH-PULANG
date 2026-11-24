import * as THREE from 'three';

interface ProceduralTextureBundle {
  asphalt: THREE.CanvasTexture;
  asphaltBump: THREE.CanvasTexture;
  paving: THREE.CanvasTexture;
  grass: THREE.CanvasTexture;
  woodFloor: THREE.CanvasTexture;
  woodSlat: THREE.CanvasTexture;
  stucco: THREE.CanvasTexture;
  roofTile: THREE.CanvasTexture;
  brick: THREE.CanvasTexture;
  officeGlassDay: THREE.CanvasTexture;
  officeGlassNight: THREE.CanvasTexture;
  waterBump: THREE.CanvasTexture;
  glowSprite: THREE.CanvasTexture;
}

let cachedBundle: ProceduralTextureBundle | null = null;

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function toTiledTexture(
  canvas: HTMLCanvasElement,
  repeatX: number,
  repeatY: number,
  isColor = true,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.needsUpdate = true;
  return tex;
}

export function getProceduralTextures(): ProceduralTextureBundle {
  if (cachedBundle) return cachedBundle;

  // 1. Aspal jalan realistis (butiran batu halus + jejak ban + retakan tipis)
  const [asphaltC, aCtx] = makeCanvas(512, 512);
  aCtx.fillStyle = '#2c3037';
  aCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 14000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = 34 + Math.floor(Math.random() * 28);
    aCtx.fillStyle = `rgb(${shade},${shade + 2},${shade + 5})`;
    aCtx.fillRect(x, y, 2, 2);
  }
  // Jejak ban tipis
  aCtx.fillStyle = 'rgba(18, 20, 24, 0.25)';
  aCtx.fillRect(90, 0, 75, 512);
  aCtx.fillRect(345, 0, 75, 512);

  // Bump map aspal
  const [asphaltBumpC, abCtx] = makeCanvas(256, 256);
  abCtx.fillStyle = '#808080';
  abCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 5500; i++) {
    const v = 90 + Math.floor(Math.random() * 75);
    abCtx.fillStyle = `rgb(${v},${v},${v})`;
    abCtx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }

  // 2. Paving Block Trotoar khas Indonesia
  const [pavingC, pCtx] = makeCanvas(512, 512);
  pCtx.fillStyle = '#8a867f';
  pCtx.fillRect(0, 0, 512, 512);
  const tileW = 64;
  const tileH = 32;
  for (let row = 0; row < 16; row++) {
    const offset = (row % 2) * (tileW / 2);
    for (let col = -1; col < 9; col++) {
      const x = col * tileW + offset;
      const y = row * tileH;
      const tone = 132 + Math.floor(Math.random() * 24);
      pCtx.fillStyle = `rgb(${tone},${tone - 3},${tone - 7})`;
      pCtx.fillRect(x + 2, y + 2, tileW - 4, tileH - 4);
      pCtx.strokeStyle = 'rgba(55, 52, 48, 0.35)';
      pCtx.lineWidth = 2;
      pCtx.strokeRect(x + 1, y + 1, tileW - 2, tileH - 2);
    }
  }
  for (let i = 0; i < 4000; i++) {
    pCtx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
    pCtx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  // 3. Rumput Taman & Halaman Organik
  const [grassC, gCtx] = makeCanvas(512, 512);
  gCtx.fillStyle = '#4c6642';
  gCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 240; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 14 + Math.random() * 34;
    const grad = gCtx.createRadialGradient(x, y, 2, x, y, r);
    grad.addColorStop(0, Math.random() > 0.45 ? 'rgba(96, 126, 70, 0.25)' : 'rgba(52, 74, 44, 0.28)');
    grad.addColorStop(1, 'rgba(76, 102, 66, 0)');
    gCtx.fillStyle = grad;
    gCtx.beginPath();
    gCtx.arc(x, y, r, 0, Math.PI * 2);
    gCtx.fill();
  }
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const g = 86 + Math.floor(Math.random() * 44);
    gCtx.fillStyle = `rgb(${Math.floor(g * 0.72)},${g},${Math.floor(g * 0.54)})`;
    gCtx.fillRect(x, y, 1.5, 4);
  }

  // 4. Lantai Parket Kayu Jati Hangat (Interior Rumah & Kedai Kopi)
  const [woodC, wCtx] = makeCanvas(512, 512);
  wCtx.fillStyle = '#8b6343';
  wCtx.fillRect(0, 0, 512, 512);
  const plankH = 32;
  for (let row = 0; row < 16; row++) {
    const y = row * plankH;
    const shift = (row % 3) * 140;
    for (let p = -1; p < 3; p++) {
      const px = p * 256 + shift;
      const r = 132 + Math.floor(Math.random() * 26);
      const g = Math.floor(r * 0.71);
      const b = Math.floor(r * 0.48);
      wCtx.fillStyle = `rgb(${r},${g},${b})`;
      wCtx.fillRect(px, y, 255, plankH - 1.5);
      // Serat kayu halus
      for (let s = 0; s < 10; s++) {
        wCtx.fillStyle = 'rgba(56, 32, 16, 0.09)';
        wCtx.fillRect(px, y + Math.random() * plankH, 255, 1.4);
      }
      wCtx.fillStyle = 'rgba(42, 24, 12, 0.45)';
      wCtx.fillRect(px + 254, y, 2, plankH);
    }
    wCtx.fillStyle = 'rgba(38, 22, 10, 0.35)';
    wCtx.fillRect(0, y + plankH - 1.5, 512, 1.5);
  }

  // 5. Dinding Kayu Vertikal Kafe (Wood Slats)
  const [slatC, slCtx] = makeCanvas(256, 256);
  slCtx.fillStyle = '#3a281e';
  slCtx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 16) {
    const shade = 92 + Math.floor(Math.random() * 24);
    slCtx.fillStyle = `rgb(${shade},${Math.floor(shade * 0.67)},${Math.floor(shade * 0.46)})`;
    slCtx.fillRect(x + 2, 0, 12, 256);
    slCtx.fillStyle = 'rgba(25, 15, 8, 0.5)';
    slCtx.fillRect(x, 0, 2, 256);
  }

  // 6. Plester Dinding Rumah Tropis Modern (Stucco halus)
  const [stuccoC, stCtx] = makeCanvas(256, 256);
  stCtx.fillStyle = '#ebe2d3';
  stCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 6000; i++) {
    const v = 220 + Math.floor(Math.random() * 25);
    stCtx.fillStyle = `rgba(${v},${v - 7},${v - 18},0.45)`;
    stCtx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }

  // 7. Genteng Terakota Indonesia (Roof Tiles)
  const [roofC, rCtx] = makeCanvas(256, 256);
  rCtx.fillStyle = '#8b4734';
  rCtx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 24) {
    const grad = rCtx.createLinearGradient(0, y, 0, y + 24);
    grad.addColorStop(0, '#a3563f');
    grad.addColorStop(0.75, '#823f2d');
    grad.addColorStop(1, '#4c2217');
    rCtx.fillStyle = grad;
    rCtx.fillRect(0, y, 256, 24);
    for (let x = 0; x < 256; x += 28) {
      rCtx.fillStyle = 'rgba(40, 16, 10, 0.25)';
      rCtx.fillRect(x + ((y / 24) % 2) * 14, y, 3, 24);
    }
  }

  // 8. Bata Ekspos Vintage (Toko Musik & Gang Grafiti)
  const [brickC, brCtx] = makeCanvas(256, 256);
  brCtx.fillStyle = '#5c4d44';
  brCtx.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 16; row++) {
    const off = (row % 2) * 20;
    for (let col = -1; col < 7; col++) {
      const r = 128 + Math.floor(Math.random() * 32);
      const g = 72 + Math.floor(Math.random() * 20);
      const b = 56 + Math.floor(Math.random() * 16);
      brCtx.fillStyle = `rgb(${r},${g},${b})`;
      brCtx.fillRect(col * 40 + off + 2, row * 16 + 2, 36, 12);
    }
  }

  // 9. Fasad Kaca Gedung Pencakar Langit (Siang & Malam Berpendar!)
  const buildOfficeGlass = (lit: boolean) => {
    const [c, ctx] = makeCanvas(512, 512);
    ctx.fillStyle = lit ? '#182230' : '#2a3c4f';
    ctx.fillRect(0, 0, 512, 512);
    const cols = 8;
    const rows = 10;
    const cw = 512 / cols;
    const ch = 512 / rows;
    for (let r = 0; r < rows; r++) {
      // Lantai spandrel beton/aluminium
      ctx.fillStyle = lit ? '#1e2736' : '#3d4f63';
      ctx.fillRect(0, r * ch, 512, ch * 0.24);
      for (let col = 0; col < cols; col++) {
        const x = col * cw + 4;
        const y = r * ch + ch * 0.26;
        const w = cw - 8;
        const h = ch * 0.68;
        if (lit) {
          const rand = (r * 13 + col * 7) % 11;
          if (rand < 5) {
            // Ruangan kantor hangat menyala
            const wg = ctx.createLinearGradient(x, y, x, y + h);
            wg.addColorStop(0, rand % 2 === 0 ? '#ffd68f' : '#ffe9b8');
            wg.addColorStop(1, '#c98d4b');
            ctx.fillStyle = wg;
          } else if (rand < 7) {
            // Lampu ruang rapat kebiruan lembut
            ctx.fillStyle = '#7ba3c7';
          } else {
            // Ruangan gelap reflektif
            ctx.fillStyle = '#1f2d40';
          }
        } else {
          const wg = ctx.createLinearGradient(x, y, x + w, y + h);
          wg.addColorStop(0, '#6a8cae');
          wg.addColorStop(0.5, '#4c6d8f');
          wg.addColorStop(1, '#7ea2c4');
          ctx.fillStyle = wg;
        }
        ctx.fillRect(x, y, w, h);
      }
    }
    return toTiledTexture(c, 1, 1, true);
  };

  // 10. Bump Riak Air Sungai & Danau
  const [waterC, waCtx] = makeCanvas(256, 256);
  waCtx.fillStyle = '#808080';
  waCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 420; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const rw = 10 + Math.random() * 28;
    const rh = 2 + Math.random() * 5;
    waCtx.fillStyle = Math.random() > 0.5 ? 'rgba(215,215,215,0.22)' : 'rgba(55,55,55,0.22)';
    waCtx.beginPath();
    waCtx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2);
    waCtx.fill();
  }

  // 11. Sprite Halo Cahaya Sinematik (untuk lampu jalan, string lights, headlight!)
  const [glowC, glCtx] = makeCanvas(128, 128);
  const rad = glCtx.createRadialGradient(64, 64, 2, 64, 64, 64);
  rad.addColorStop(0, 'rgba(255, 245, 215, 1)');
  rad.addColorStop(0.25, 'rgba(255, 200, 120, 0.55)');
  rad.addColorStop(0.6, 'rgba(255, 165, 75, 0.16)');
  rad.addColorStop(1, 'rgba(255, 150, 60, 0)');
  glCtx.fillStyle = rad;
  glCtx.fillRect(0, 0, 128, 128);
  const glowSprite = new THREE.CanvasTexture(glowC);
  glowSprite.colorSpace = THREE.SRGBColorSpace;

  cachedBundle = {
    asphalt: toTiledTexture(asphaltC, 12, 2, true),
    asphaltBump: toTiledTexture(asphaltBumpC, 16, 4, false),
    paving: toTiledTexture(pavingC, 16, 16, true),
    grass: toTiledTexture(grassC, 28, 28, true),
    woodFloor: toTiledTexture(woodC, 3, 3, true),
    woodSlat: toTiledTexture(slatC, 4, 2, true),
    stucco: toTiledTexture(stuccoC, 3, 2, true),
    roofTile: toTiledTexture(roofC, 4, 3, true),
    brick: toTiledTexture(brickC, 3, 2, true),
    officeGlassDay: buildOfficeGlass(false),
    officeGlassNight: buildOfficeGlass(true),
    waterBump: toTiledTexture(waterC, 8, 8, false),
    glowSprite,
  };

  return cachedBundle;
}
