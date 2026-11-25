import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { detectIsMobileDevice } from '../../utils/mobileUtils';

interface PerformanceOptimizerProps {
  settings: GameSettings;
  timeOfDay: TimeOfDay;
}

interface TrackedPointLight {
  light: THREE.PointLight;
  worldPos: THREE.Vector3;
}

interface TrackedDistrictGroup {
  obj: THREE.Object3D;
  cx: number;
  cz: number;
  radius: number;
}

const DISTRICT_ROOT_NAME = '__district_detail_root__';

/**
 * Pengoptimal Performa 3D Real-Time Level 2 (Anti-Lag HP & Mode 60 FPS HP Kentang):
 * 1. Spatial District Detail Culler — menyembunyikan otomatis grup properti detail distrik yang
 *    berada jauh dari Damar (>42m pada HP Kentang, >58m pada Hemat HP) dengan histeresis anti-kedip
 *    4 meter, tanpa mengubah bangunan, jalan, kendaraan, NPC, atau objek cerita utama!
 * 2. PointLight Distance Culler — membatasi lampu aktif serentak (2 di HP Kentang, 3 di Hemat HP)
 *    agar beban fragment shader GPU HP turun drastis.
 * 3. Dynamic Camera Far-Plane — memangkas geometri jauh di balik kabut.
 * 4. Zero-Re-Render FPS & Draw-Call Telemetry — menulis FPS, frame time, jumlah draw call &
 *    grup yang di-cull ke playerRuntime.perf tanpa membebani React.
 */
export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  settings,
  timeOfDay,
}) => {
  const { scene, camera, gl } = useThree();
  const isMobile = detectIsMobileDevice();
  const isTelescopeOpen = useGameStore((s) => s.isTelescopeOpen);
  const screen = useGameStore((s) => s.screen);

  const lightsRef = useRef<TrackedPointLight[]>([]);
  const districtGroupsRef = useRef<TrackedDistrictGroup[]>([]);
  const lastCullRef = useRef(0);
  const lastScanRef = useRef(0);
  const needsDistrictRescanRef = useRef(true);

  // Pelacakan FPS mulus per jendela 450ms (nol alokasi objek di dalam useFrame)
  const fpsAccumFramesRef = useRef(0);
  const fpsWindowStartRef = useRef(performance.now());

  const restoreAllCulledGroups = () => {
    const groups = districtGroupsRef.current;
    for (let i = 0; i < groups.length; i++) {
      const obj = groups[i].obj;
      if (obj.userData?.__culledByPerf) {
        obj.visible = true;
        obj.userData.__culledByPerf = false;
      }
    }
    playerRuntime.perf.culledProps = 0;
  };

  const scanDistrictGroups = () => {
    restoreAllCulledGroups();
    const detailRoot = scene.getObjectByName(DISTRICT_ROOT_NAME);
    if (!detailRoot) {
      districtGroupsRef.current = [];
      playerRuntime.perf.totalProps = 0;
      return;
    }

    detailRoot.updateWorldMatrix(true, true);

    const found: TrackedDistrictGroup[] = [];
    const tmpBox = new THREE.Box3();
    const tmpSize = new THREE.Vector3();
    const tmpCenter = new THREE.Vector3();

    const walk = (node: THREE.Object3D, depth: number) => {
      if (node.userData?.noCull) return;
      // Jangan pernah menyentuh grup yang memang sengaja disembunyikan oleh logika komponennya
      if (!node.visible && !node.userData?.__culledByPerf) return;

      if (depth === 0) {
        // Depth 0 = wrapper root masing-masing komponen distrik -> masuk ke anak-anaknya
        for (let i = 0; i < node.children.length; i++) {
          walk(node.children[i], 1);
        }
        return;
      }

      // Hanya cull node berbentuk Group (kontainer kios/properti), bukan Mesh lepas atau objek bergerak
      if (node.type !== 'Group') return;

      tmpBox.setFromObject(node);
      if (tmpBox.isEmpty()) return;

      tmpBox.getSize(tmpSize);
      const spanXZ = Math.max(tmpSize.x, tmpSize.z);

      // Jika wrapper masih mencakup beberapa distrik berjauhan (>36m), pecah satu tingkat lebih dalam
      if (spanXZ > 36 && depth < 2 && node.children.length > 1) {
        for (let i = 0; i < node.children.length; i++) {
          walk(node.children[i], depth + 1);
        }
        return;
      }

      // Lewati grup raksasa lintas kota (>62m) agar tidak menyembunyikan elemen global secara keliru
      if (spanXZ > 62) return;

      tmpBox.getCenter(tmpCenter);
      const radius = Math.min(20, Math.hypot(tmpSize.x, tmpSize.z) * 0.5);
      found.push({
        obj: node,
        cx: tmpCenter.x,
        cz: tmpCenter.z,
        radius,
      });
    };

    for (let i = 0; i < detailRoot.children.length; i++) {
      walk(detailRoot.children[i], 0);
    }

    districtGroupsRef.current = found;
    playerRuntime.perf.totalProps = found.length;
    needsDistrictRescanRef.current = false;
  };

  // Sesuaikan jarak render kamera agar objek jauh di balik kabut tidak membuang draw call & rasterizer
  useEffect(() => {
    const pCam = camera as THREE.PerspectiveCamera;
    const isPotato = settings.graphicsQuality === 'potato';
    const targetFar = isPotato
      ? 96
      : settings.drawDistance === 'near'
        ? isMobile
          ? 124
          : 155
        : settings.drawDistance === 'medium'
          ? 205
          : 295;
    if (Math.abs(pCam.far - targetFar) > 1) {
      pCam.far = targetFar;
      pCam.updateProjectionMatrix();
    }
  }, [camera, settings.drawDistance, settings.graphicsQuality, isMobile]);

  // Pindai ulang daftar PointLight & tandai rescan grup detail distrik saat waktu berubah
  useEffect(() => {
    const found: TrackedPointLight[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.PointLight).isPointLight) {
        found.push({
          light: obj as THREE.PointLight,
          worldPos: new THREE.Vector3(),
        });
      }
    });
    lightsRef.current = found;
    playerRuntime.perf.totalLights = found.length;
    lastScanRef.current = performance.now();
    lastCullRef.current = 0;
    needsDistrictRescanRef.current = true;
  }, [scene, timeOfDay]);

  // Pulihkan semua grup jika fitur culling dimatikan atau saat teropong Rooftop 8x sedang dibuka
  useEffect(() => {
    if (!settings.districtCulling || isTelescopeOpen) {
      restoreAllCulledGroups();
    }
  }, [settings.districtCulling, isTelescopeOpen]);

  // Pastikan semua grup kembali terlihat saat komponen dilepas
  useEffect(() => {
    return () => {
      restoreAllCulledGroups();
    };
  }, []);

  useFrame(({ clock }) => {
    const perf = playerRuntime.perf;
    const isPotato = settings.graphicsQuality === 'potato';
    const isLow = settings.graphicsQuality === 'low';
    const isMed = settings.graphicsQuality === 'medium';

    perf.frameIndex = (perf.frameIndex + 1) & 0x3fffffff;
    perf.isPotato = isPotato;
    perf.isLowPerf = isPotato || isLow || isMobile;

    // 1. Pembaruan telemetri FPS & draw call ringan setiap ~450ms
    fpsAccumFramesRef.current += 1;
    const nowMs = performance.now();
    const elapsedMs = nowMs - fpsWindowStartRef.current;
    if (elapsedMs >= 450) {
      const instantFps = (fpsAccumFramesRef.current * 1000) / Math.max(1, elapsedMs);
      perf.fps = Math.round(perf.fps * 0.35 + instantFps * 0.65);
      perf.frameMs = Math.round((elapsedMs / Math.max(1, fpsAccumFramesRef.current)) * 10) / 10;
      perf.drawCalls = gl.info.render.calls;
      perf.triangles = gl.info.render.triangles;
      fpsAccumFramesRef.current = 0;
      fpsWindowStartRef.current = nowMs;
    }

    const t = clock.getElapsedTime();
    if (t - lastCullRef.current < 0.25) return;
    lastCullRef.current = t;

    // Rescan berkala setiap 4.5 detik untuk menangkap lampu dinamis yang baru muncul
    if (nowMs - lastScanRef.current > 4500) {
      lastScanRef.current = nowMs;
      const found: TrackedPointLight[] = [];
      scene.traverse((obj) => {
        if ((obj as THREE.PointLight).isPointLight) {
          found.push({
            light: obj as THREE.PointLight,
            worldPos: new THREE.Vector3(),
          });
        }
      });
      lightsRef.current = found;
      perf.totalLights = found.length;
    }

    if (needsDistrictRescanRef.current) {
      scanDistrictGroups();
    }

    const [px, py, pz] = playerRuntime.position;
    const camX = camera.position.x;
    const camZ = camera.position.z;

    // 2. PointLight Distance Culler (sangat krusial untuk GPU ponsel Adreno/Mali/Apple)
    const list = lightsRef.current;
    if (list.length > 0) {
      const maxLights = isPotato
        ? 2
        : isLow || (isMobile && isMed)
          ? 3
          : isMed || isMobile
            ? 6
            : 14;
      const maxDistSq = isPotato
        ? 18 * 18
        : isLow
          ? 25 * 25
          : isMed || isMobile
            ? 38 * 38
            : 72 * 72;

      const scored: { item: TrackedPointLight; dSq: number }[] = [];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (!item.light.parent) continue;
        item.light.getWorldPosition(item.worldPos);
        const dx = item.worldPos.x - px;
        const dy = item.worldPos.y - (py + 1.5);
        const dz = item.worldPos.z - pz;
        scored.push({ item, dSq: dx * dx + dy * dy + dz * dz });
      }

      scored.sort((a, b) => a.dSq - b.dSq);

      let activeCount = 0;
      for (let i = 0; i < scored.length; i++) {
        const { item, dSq } = scored[i];
        const on = i < maxLights && dSq <= maxDistSq;
        item.light.visible = on;
        if (on) activeCount += 1;
      }
      perf.activeLights = activeCount;
    }

    // 3. Spatial Distance Culling Detail Distrik (>42m HP Kentang, >58m Hemat HP / Mobile)
    const cullRadius = isPotato ? 42 : isLow || isMobile ? 58 : 70;
    perf.cullRadius = cullRadius;

    if (!settings.districtCulling || isTelescopeOpen) {
      perf.culledProps = 0;
      return;
    }

    const groups = districtGroupsRef.current;
    let culledCount = 0;
    const useCameraOnly = screen === 'title';

    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      if (!g.obj.parent) continue;

      const dCam = Math.hypot(g.cx - camX, g.cz - camZ);
      const dist = useCameraOnly
        ? dCam
        : Math.min(Math.hypot(g.cx - px, g.cz - pz), dCam);

      const wasCulled = Boolean(g.obj.userData.__culledByPerf);
      const showLimit = cullRadius + g.radius;
      const hideLimit = showLimit + 4.0; // Histeresis 4m agar properti tidak berkedip di batas jarak

      if (!wasCulled && dist > hideLimit) {
        g.obj.visible = false;
        g.obj.userData.__culledByPerf = true;
        culledCount += 1;
      } else if (wasCulled && dist < showLimit) {
        g.obj.visible = true;
        g.obj.userData.__culledByPerf = false;
      } else if (wasCulled) {
        culledCount += 1;
      }
    }

    perf.culledProps = culledCount;
  });

  return null;
};
