import React, { Dispatch, useEffect, useRef, useState } from "react";
import colorPalette from "../data/ColorPalette.json";
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from "react-leaflet";
import { GeoJsonObject } from "geojson";
import "./Map.scss";
import { MapAction, MapState, TimeLineData, MapActionType } from "../App";

interface Props {
  mapData: MapState;
  dispatch: Dispatch<MapAction>;
}

interface GeoJsonLayerProps {
  geoJsonData: GeoJsonObject | null;
  geoJsonLayer: any;
}

// write two components separately because useMapEffect (provided by react-leaflet) can only be used inside <MapContainer>
function GeoJsonLayer({ geoJsonData, geoJsonLayer }: GeoJsonLayerProps) {
  const generateColor = (name: string) => {
    let index: number = 0,
      i: number;
    for (i = 0; i < name.length; i++) {
      index += name.charCodeAt(i);
    }
    return colorPalette.color[index % 16];
  };
  const [zoomLevel, setZoomLevel] = useState<number>(4);
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
      // console.log(zoomLevel);
    },
  });
  useEffect(() => {
    if (geoJsonLayer.current) {
      geoJsonLayer.current.clearLayers().addData(geoJsonData);
    }
  }, [zoomLevel]);

  return geoJsonData ? (
    <GeoJSON
      ref={geoJsonLayer}
      data={geoJsonData}
      style={(feature) => {
        if (!feature?.properties.NAME) {
          return { color: "red", weight: 1 };
        }
        return { color: generateColor(feature.properties.NAME), weight: 1 };
      }}
      filter={(feature) => {
        return feature.properties?.NAME !== null;
      }}
      onEachFeature={(feature, layer) => {
        layer.bindTooltip(feature.properties.NAME, {
          // permanent: true,
          direction: "center",
          className:
            mapEvents.getZoom() > 3 ? "countryName" : "zoomedCountryName",
        });
        layer.on({ click: () => console.log(feature.properties.NAME) });
      }}
    ></GeoJSON>
  ) : null;
}

export default function Map({ mapData, dispatch }: Props) {
  const { geoJsonData } = mapData;

  const geoJsonLayer = useRef<any>(null);
  useEffect(() => {
    if (geoJsonLayer.current) {
      geoJsonLayer.current.clearLayers().addData(geoJsonData);
    }
  }, [geoJsonData]);
  return (
    <MapContainer
      id="map"
      center={[39, 2]}
      zoom={4}
      maxZoom={6}
      minZoom={2}
      maxBounds={[
        [90, -180],
        [-90, 180],
      ]}
      inertia={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
      />
      <GeoJsonLayer
        geoJsonData={geoJsonData}
        geoJsonLayer={geoJsonLayer}
      ></GeoJsonLayer>
    </MapContainer>
  );
}
