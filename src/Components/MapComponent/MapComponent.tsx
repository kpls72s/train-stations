import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import React, { memo, useEffect, useMemo } from "react";
import L from "leaflet";
import type { Center, MapDetails } from "./MapComponentTypes";

const GERMANY_POSITION: Center = [51.01712, 10.05861];
const DEFAULT_ZOOM = 6;

// Customize marker icon size
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [25, 41], // width, height in pixels
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const Mapcomponent: React.FC<{
  stations: MapDetails;
  filterBystation: string;
  filterByStationHandler: (value: string) => void;
  city: string;
}> = ({ stations, filterBystation, filterByStationHandler, city }) => {
  // Determine selected station or city center without causing side-effects
  const selectedStation = useMemo(
    () => (filterBystation !== "" ? stations.find((s) => s.id === +filterBystation) : undefined),
    [filterBystation, stations],
  );

  const cityCenterStation = useMemo(
    () => (city !== "" ? stations.find((s) => s.city === city) : undefined),
    [city, stations],
  );

  const CENTER = useMemo(() => {
    if (selectedStation) return [selectedStation.lat, selectedStation.lng] as Center;
    if (cityCenterStation) return [cityCenterStation.lat, cityCenterStation.lng] as Center;
    return GERMANY_POSITION;
  }, [selectedStation, cityCenterStation]);

  const ZOOM = selectedStation ? 14 : cityCenterStation ? 10 : DEFAULT_ZOOM;

  const STATIONS = useMemo(
    () => stations.filter((station) => (city !== "" ? station.city === city : true)),
    [city, stations],
  );

  // Component that applies map view changes imperatively via react-leaflet hook
  function MapController({ center, zoom }: { center: Center; zoom: number }) {
    const map = useMap();
    useEffect(() => {
      if (!map || !center) return;
      map.setView(center, zoom, { animate: true });
    }, [map, center, zoom]);
    return null;
  }

  return (
    <MapContainer center={CENTER} zoom={ZOOM} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {STATIONS.map((station) => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          icon={customIcon}
          eventHandlers={{ click: () => filterByStationHandler(station.id.toString()) }}
        />
      ))}

      <MapController center={CENTER} zoom={ZOOM} />
    </MapContainer>
  );
};
export default memo(Mapcomponent);
