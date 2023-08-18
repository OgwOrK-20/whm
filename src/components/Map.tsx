import React, { Dispatch, useEffect, useRef, useState } from "react";
import colorPalette from "../data/ColorPalette.json";
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from "react-leaflet";
import "./Map.scss";
import { MapAction, MapActionType, MapState } from "../App";

interface Props {
  mapData: MapState;
  dispatch: Dispatch<MapAction>;
}

interface GeoJsonLayerProps {
  dispatch: Dispatch<MapAction>;
  mapData: MapState;
  geoJsonLayer: any;
}

// write two components separately because useMapEffect (provided by react-leaflet) can only be used inside <MapContainer>
function GeoJsonLayer({ mapData, geoJsonLayer, dispatch }: GeoJsonLayerProps) {
  const { geoJsonData, selectedArea } = mapData;
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
      // mapEvents.getPane("123");
      // mapEvents.eachLayer((l) => {
      //   if (l.options.pane === "tooltipPane") {
      //     console.log(l);
      //   }
      // });
      setZoomLevel(mapEvents.getZoom());
    },
  });

  const setSelectedArea = (area: string) => {
    dispatch({
      type: MapActionType.SETAREA,
      selectedArea: area,
    });
  };

  useEffect(() => {
    // if (geoJsonLayer.current) {
    //   // geoJsonLayer.current.clearLayers().addData(geoJsonData);
    // }
    console.log(zoomLevel);
    if (zoomLevel < 4) {
      document
        .querySelectorAll(".countryName")
        .forEach((e) => e.classList.add("zoomedCountryName"));
    }
  }, [zoomLevel]);

  if (zoomLevel < 4) {
    document
      .querySelectorAll(".leaflet-tooltip-pane")
      .forEach((e) => e.classList.add("zoomedCountryName"));
  }
  return geoJsonData ? (
    <GeoJSON
      ref={geoJsonLayer}
      data={geoJsonData}
      style={(feature) => {
        if (!feature?.properties.NAME) {
          return { color: "red", weight: 10 };
        }
        if (feature.properties.NAME === selectedArea) {
          return { color: generateColor(feature.properties.NAME), weight: 4 };
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
          className: "countryName",
        });
        layer.on({ click: (e) => setSelectedArea(feature.properties.NAME) });
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
        [90, -240],
        [-90, 240],
      ]}
      inertia={false}
      doubleClickZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
      />
      <GeoJsonLayer
        geoJsonLayer={geoJsonLayer}
        dispatch={dispatch}
        mapData={mapData}
      ></GeoJsonLayer>
    </MapContainer>
  );
}
