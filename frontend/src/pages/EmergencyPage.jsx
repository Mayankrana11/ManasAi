import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  PhoneCall, Users, MapPin, Navigation, 
  ShieldCheck, ArrowLeft, RefreshCcw, AlertCircle, Loader2
} from "lucide-react";

// Fix for default Leaflet markers
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 16);
  }, [coords, map]);
  return null;
}

export default function EmergencyPage({ setPage }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Determining exact location...");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [sosTriggered, setSosTriggered] = useState(false);
  const timerRef = useRef(null);

  const updateLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const currentLoc = { lat: latitude, lng: longitude };
        setLocation(currentLoc);
        fetchAddress(latitude, longitude);
        fetchHospitals(currentLoc);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) setError("Location permission denied. Please enable GPS.");
        else if (err.code === 2) setError("Position unavailable. Check your signal.");
        else setError("Location timeout. Try again.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18`);
      const data = await res.json();
      setAddress(data.display_name || "Address found");
    } catch (err) {
      setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    }
  };

  const fetchHospitals = async (coords) => {
    try {
      const query = `[out:json];(node["amenity"="hospital"](around:5000,${coords.lat},${coords.lng}););out center;`;
      const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
      const data = await res.json();
      const results = data.elements.map(el => {
        const lat = el.lat || el.center?.lat;
        const lng = el.lon || el.center?.lng;
        const R = 6371; 
        const dLat = ((lat - coords.lat) * Math.PI) / 180;
        const dLon = ((lng - coords.lng) * Math.PI) / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(coords.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const dist = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        return { name: el.tags.name || "Medical Center", lat, lng, distance: dist.toFixed(2) };
      }).sort((a, b) => a.distance - b.distance);
      setHospitals(results.slice(0, 5));
    } catch (err) { console.error("Hospital Fetch Error", err); }
  };

  useEffect(() => { updateLocation(); }, []);

  const startPress = () => {
    setIsPressing(true);
    let start = Date.now();
    timerRef.current = setInterval(() => {
      let elapsed = Date.now() - start;
      let progress = (elapsed / 3000) * 100;
      if (progress >= 100) {
        setPressProgress(100);
        setSosTriggered(true);
        clearInterval(timerRef.current);
        // Add actual emergency API call here if needed
      } else {
        setPressProgress(progress);
      }
    }, 50);
  };

  const stopPress = () => {
    setIsPressing(false);
    setPressProgress(0);
    clearInterval(timerRef.current);
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${sosTriggered ? 'bg-red-50' : 'bg-slate-50'}`}>
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6 md:mb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setPage("AppDesktop")} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition"><ArrowLeft /></button>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900">Emergency</h1>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase ${location ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          <ShieldCheck size={16} /> {location ? "GPS Active" : "Searching..."}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Address Card */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest"><MapPin size={16}/> Current Location</span>
              <button onClick={updateLocation} className={`text-slate-400 hover:text-blue-600 transition ${loading ? 'animate-spin' : ''}`}><RefreshCcw size={18}/></button>
            </div>
            {error ? (
              <div className="flex items-center gap-2 text-red-500 font-bold">
                <AlertCircle size={20} /> {error}
              </div>
            ) : (
              <>
                <p className="text-lg md:text-xl font-bold text-slate-800 leading-tight mb-2">{address}</p>
                <p className="text-xs font-mono text-slate-400">Coord: {location?.lat?.toFixed(5) || "0"}, {location?.lng?.toFixed(5) || "0"}</p>
              </>
            )}
          </div>

          {/* Map Section */}
          <div className="h-[400px] md:h-[500px] rounded-[40px] overflow-hidden border-4 border-white shadow-xl bg-slate-200 relative">
            {location ? (
              <MapContainer center={[location.lat, location.lng]} zoom={16} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap coords={location} />
                <Marker position={[location.lat, location.lng]}><Popup>You are here</Popup></Marker>
                {hospitals.map((h, i) => (
                  <Marker key={i} position={[h.lat, h.lng]} icon={hospitalIcon}>
                    <Popup><b>{h.name}</b><br/>{h.distance} km</Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="font-black animate-pulse uppercase tracking-tighter">Connecting to Satellites...</p>
                {error && <button onClick={updateLocation} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-bold">Retry GPS</button>}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <a href="tel:102" className="bg-red-500 p-6 md:p-8 rounded-[32px] text-white flex flex-col items-center hover:bg-red-600 transition shadow-lg shadow-red-200">
              <PhoneCall size={32} className="mb-2" />
              <span className="font-black text-xs uppercase">Ambulance</span>
            </a>
            <button className="bg-amber-400 p-6 md:p-8 rounded-[32px] text-slate-900 flex flex-col items-center hover:bg-amber-500 transition shadow-lg shadow-amber-100">
              <Users size={32} className="mb-2" />
              <span className="font-black text-xs uppercase">Family</span>
            </button>
          </div>

          {/* Hospital List */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm min-h-[300px]">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Nearby Help</h2>
            <div className="space-y-4">
              {hospitals.length > 0 ? hospitals.map((h, i) => (
                <div key={i} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-2xl transition">
                  <div className="max-w-[70%]">
                    <p className="font-black text-slate-800 text-sm truncate">{h.name}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase">{h.distance} km away</p>
                  </div>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`)} 
                    className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition"
                  >
                    <Navigation size={18} />
                  </button>
                </div>
              )) : (
                <div className="space-y-4">
                   {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SOS Button */}
      <div className="fixed bottom-8 right-8 md:bottom-12 md:right-12 flex flex-col items-center z-[1000]">
        <div 
          className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center cursor-pointer select-none touch-none"
          onMouseDown={startPress} onMouseUp={stopPress} onMouseLeave={stopPress}
          onTouchStart={startPress} onTouchEnd={stopPress}
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="45%" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
            <circle 
              cx="50%" cy="50%" r="45%" stroke={sosTriggered ? "#22c55e" : "#dc2626"} strokeWidth="10" fill="transparent" 
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * pressProgress) / 100}
              className="transition-all duration-75 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${sosTriggered ? 'bg-green-500 scale-110' : 'bg-red-600 scale-100 active:scale-95'} text-white`}>
            {sosTriggered ? <ShieldCheck size={40} /> : <span className="font-black text-xl md:text-2xl text-white">SOS</span>}
          </div>
        </div>
        {isPressing && !sosTriggered && (
          <p className="mt-4 font-black text-[10px] text-red-600 uppercase animate-bounce">
            Keep Holding...
          </p>
        )}
      </div>
    </div>
  );
}