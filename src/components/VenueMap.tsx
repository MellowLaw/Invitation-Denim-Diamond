import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, Layers } from 'lucide-react';
import { EVENT_INFO } from '../data/reunionData';

type MapLayerMode = 'street' | 'satellite';

const TILE_CONFIG: Record<MapLayerMode, { url: string; attribution: string }> = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
};

export default function VenueMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [layerMode, setLayerMode] = useState<MapLayerMode>('street');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { lat, lng } = EVENT_INFO.venueCoords;
    // Slight northward view offset keeps both pin tip and open popup balanced in mobile viewports
    const map = L.map(container, {
      center: [lat + 0.0005, lng],
      zoom: 16,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    const initialLayer = L.tileLayer(TILE_CONFIG.street.url, {
      maxZoom: 19,
      attribution: TILE_CONFIG.street.attribution,
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: '',
      iconSize: [44, 56],
      iconAnchor: [22, 52],
      popupAnchor: [0, -50],
      html: `
        <div style="position:relative;width:44px;height:56px;pointer-events:auto;">
          <span
            class="venue-pin-pulse"
            style="position:absolute;left:10px;top:40px;width:24px;height:24px;border-radius:9999px;background:rgba(37,99,235,0.42);border:2px solid rgba(158,197,255,0.9);"
          ></span>
          <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:relative;display:block;filter:drop-shadow(0 6px 12px rgba(4,10,24,0.55));">
            <path d="M22 2C11.5066 2 3 10.5066 3 21C3 34.125 22 50 22 50C22 50 41 34.125 41 21C41 10.5066 32.4934 2 22 2Z" fill="#1d4ed8" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M22 12L28.5 20.5L22 29L15.5 20.5L22 12Z" fill="#f5d79b" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>
          </svg>
        </div>
      `,
    });

    const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
    marker.bindPopup(
      `<div style="text-align:center;min-width:170px;padding:2px 2px;text-shadow:none;">
        <div style="font-family:var(--font-serif);font-size:18px;font-weight:700;color:#0e1f3d;line-height:1.15;text-shadow:none;">${EVENT_INFO.venueName}</div>
        <div style="margin-top:3px;font-size:11px;font-weight:600;color:#2b446c;line-height:1.35;text-shadow:none;">${EVENT_INFO.venueLandmark}</div>
      </div>`,
      {
        className: 'venue-leaflet-popup',
        closeButton: true,
        autoClose: false,
      }
    );
    marker.openPopup();

    mapRef.current = map;
    tileLayerRef.current = initialLayer;
    markerRef.current = marker;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          map.invalidateSize();
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const fallbackTimer = window.setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      window.clearTimeout(fallbackTimer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const nextConfig = TILE_CONFIG[layerMode];
    tileLayerRef.current = L.tileLayer(nextConfig.url, {
      maxZoom: 19,
      attribution: nextConfig.attribution,
    }).addTo(map);
  }, [layerMode]);

  const handleRecenter = () => {
    const map = mapRef.current;
    if (!map) return;
    const { lat, lng } = EVENT_INFO.venueCoords;
    map.setView([lat + 0.0005, lng], 16, { animate: true });
    markerRef.current?.openPopup();
  };

  return (
    <div
      style={{ textShadow: 'none' }}
      className="relative z-20 isolate h-[290px] w-full overflow-hidden rounded-2xl shadow-[0_24px_56px_rgba(2,6,16,0.85)] sm:h-[370px]"
    >
      <div
        ref={containerRef}
        className="h-full w-full bg-[#dce6f5]"
        aria-label="Interactive map centered on Tropical Bali in front of Rizal Elementary School, Rizal, Laguna"
      />

      {/* Compact Bottom-Left White Layer & Recenter Controls */}
      <div className="pointer-events-auto absolute bottom-3 left-3 z-[1100] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLayerMode((prev) => (prev === 'street' ? 'satellite' : 'street'))}
          className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full border border-[#0e1f3d]/12 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0e1f3d] shadow-[0_6px_18px_rgba(4,10,24,0.24)] transition hover:bg-[#eef4ff] hover:text-[#1d4ed8]"
        >
          <Layers className="h-3.5 w-3.5 text-[#1d4ed8]" />
          {layerMode === 'street' ? 'Satellite' : 'Street'}
        </button>

        <button
          type="button"
          onClick={handleRecenter}
          className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full border border-[#0e1f3d]/12 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0e1f3d] shadow-[0_6px_18px_rgba(4,10,24,0.24)] transition hover:bg-[#eef4ff] hover:text-[#1d4ed8]"
          title="Recenter map on venue pin"
        >
          <Crosshair className="h-3.5 w-3.5 text-[#1d4ed8]" />
          Recenter
        </button>
      </div>
    </div>
  );
}
