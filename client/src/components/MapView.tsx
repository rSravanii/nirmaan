import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ProblemReport } from '../types/index.js';
import { MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix Leaflet's default marker icon paths in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG pin markers based on severity
function createSeverityIcon(severity: string) {
  let color = '#10b981'; // green for LOW
  if (severity === 'MEDIUM') color = '#f59e0b'; // amber
  if (severity === 'HIGH') color = '#f97316'; // orange
  if (severity === 'CRITICAL') color = '#ef4444'; // red

  const svg = `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 16 42 16 42C16 42 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="${color}"/>
      <circle cx="16" cy="16" r="7" fill="white"/>
      <circle cx="16" cy="16" r="4" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-map-pin',
    html: svg,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38],
  });
}

interface MapViewProps {
  problems: ProblemReport[];
  selectedProblemId?: string;
  onSelectProblem?: (problem: ProblemReport) => void;
  center?: [number, number];
  zoom?: number;
}

export const MapView: React.FC<MapViewProps> = ({
  problems,
  selectedProblemId,
  onSelectProblem,
  center = [23.6102, 85.2799], // Central Jharkhand (Ranchi/Ramgarh)
  zoom = 8,
}) => {
  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ minHeight: '420px', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {problems.map((prob) => {
          const lat = prob.coordinates?.latitude || 23.3441;
          const lng = prob.coordinates?.longitude || 85.3096;

          return (
            <Marker
              key={prob._id}
              position={[lat, lng]}
              icon={createSeverityIcon(prob.severity)}
              eventHandlers={{
                click: () => onSelectProblem && onSelectProblem(prob),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 max-w-xs space-y-2 text-slate-800">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      prob.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      prob.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      prob.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {prob.severity} Severity
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {prob.district}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                    {prob.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {prob.aiSummary || prob.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {prob.village || prob.district}
                    </span>
                    <span className="font-bold text-emerald-700">
                      ~{prob.affectedPopulation || 150} people
                    </span>
                  </div>

                  {prob.isDuplicate && prob.clusterId && (
                    <div className="p-1.5 bg-amber-50 rounded border border-amber-200 text-[10px] text-amber-800 font-semibold">
                      Part of Cluster: {prob.clusterId.reportCount || 2}+ reports merged
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <Link
                      to={`/problems/${prob._id}`}
                      className="flex-1 text-center py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
