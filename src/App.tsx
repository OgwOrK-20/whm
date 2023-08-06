import React, { useReducer } from "react";
import { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import TimeLine from "./components/TimeLine";
import { BrowserRouter } from "react-router-dom";
import { GeoJsonObject } from "geojson";

export enum MapActionType {
  SETYEAR = "SETYEAR",
  SETGEODATA = "SETGEODATA",
}

export interface MapAction {
  type: MapActionType;
  selectedYear: TimeLineData | null;
  geoJsonData: GeoJsonObject | null;
}

export interface TimeLineData {
  year: string;
  data: string;
}

export interface MapState {
  selectedYear: TimeLineData | null;
  geoJsonData: GeoJsonObject | null;
}

const mapReducer = (state: MapState, action: MapAction) => {
  switch (action.type) {
    case MapActionType.SETYEAR: {
      return {
        ...state,
        selectedYear: action.selectedYear,
      };
    }
    case MapActionType.SETGEODATA: {
      return {
        ...state,
        geoJsonData: action.geoJsonData,
      };
    }
    default: {
      return state;
    }
  }
};

const initialMapData: MapState = {
  selectedYear: null,
  geoJsonData: null,
};

function App() {
  const [mapData, dispatch] = useReducer(mapReducer, initialMapData);
  const [selectedYear, setSelectedYear] = useState<TimeLineData | null>(null);
  const [geoData, setGeoData] = useState<GeoJsonObject>({
    type: "Feature",
  });
  return (
    <React.Fragment>
      <BrowserRouter>
        <Map mapData={mapData} dispatch={dispatch}></Map>
        <TimeLine mapData={mapData} dispatch={dispatch}></TimeLine>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
