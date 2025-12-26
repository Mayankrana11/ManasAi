// ✅MAIN EMERGENCY PAGE✅
// --- imports (place at top of App.jsx if not already there) ---
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Define the hospital icon once
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// ✅ Emergency Page Component
function EmergencyPage() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utility: compute distance between two coordinates (in km)
  const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ✅ Fetch location and nearby hospitals
  useEffect(() => {
    const getLocation = async () => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported by this browser.");
        await fallbackToIP();
        return;
      }

      const watch = navigator.geolocation.watchPosition(
        async (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          await fetchHospitals(coords);
        },
        async (err) => {
          console.warn("GPS failed:", err.message);
          setError("Using approximate location (IP-based).");
          await fallbackToIP();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watch);
    };

    const fallbackToIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const coords = { lat: data.latitude, lng: data.longitude };
        setLocation(coords);
        await fetchHospitals(coords);
      } catch (err) {
        setError("Unable to determine location.");
      } finally {
        setLoading(false);
      }
    };

    const fetchHospitals = async (coords) => {
      try {
        const query = `
          [out:json];
          (
            node["amenity"="hospital"](around:5000,${coords.lat},${coords.lng});
            way["amenity"="hospital"](around:5000,${coords.lat},${coords.lng});
            relation["amenity"="hospital"](around:5000,${coords.lat},${coords.lng});
          );
          out center;
        `;
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query,
        });
        const data = await response.json();

        const results = data.elements
          .map((el) => ({
            name: el.tags.name || "Unnamed Hospital",
            lat: el.lat || el.center?.lat,
            lng: el.lon || el.center?.lon,
          }))
          .filter((h) => h.lat && h.lng)
          .map((h) => ({
            ...h,
            distance: calcDistance(coords.lat, coords.lng, h.lat, h.lng).toFixed(2),
          }));

        setHospitals(results.slice(0, 10));
        setLoading(false);
      } catch (err) {
        console.error("Overpass fetch error:", err);
        setError("Failed to fetch nearby hospitals.");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-md relative">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Emergency Assistance
      </h1>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mb-10 flex-wrap">
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition">
          🚑 Call Ambulance
        </button>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-3 rounded-full font-semibold text-lg shadow-md transition">
          🔔 Notify Family
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition">
          🩺 Notify Doctor
        </button>
      </div>

      {/* Status */}
      {loading && (
        <p className="text-center text-gray-500 mb-6">📍 Getting your live location...</p>
      )}
      {error && <p className="text-center text-red-500 mb-6">⚠️ {error}</p>}

      {/* Hospital Data + Map */}
      {location && !loading && (
        <div className="space-y-6">
          {/* Hospital list */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🏥 Nearby Hospitals
            </h2>

            {hospitals.length === 0 ? (
              <p className="text-gray-500">No hospitals found nearby.</p>
            ) : (
              <ul className="text-gray-600 space-y-2 text-base">
                {hospitals.map((h, i) => (
                  <li key={i}>
                    {h.name} — <span className="text-gray-400">{h.distance} km away</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Live Map */}
          <div className="h-[350px] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User location */}
              <Marker position={[location.lat, location.lng]}>
                <Popup>You are here</Popup>
              </Marker>

              {/* Hospitals */}
              {hospitals.map((h, i) => (
                <Marker key={i} position={[h.lat, h.lng]} icon={hospitalIcon}>
                  <Popup>
                    {h.name} <br />
                    {h.distance} km away
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Floating SOS button */}
      <button className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-lg transition">
        SOS
      </button>
    </div>
  );
}

export default EmergencyPage;