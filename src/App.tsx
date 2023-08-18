import React, { useReducer } from "react";
import { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import TimeLine from "./components/TimeLine";
import { BrowserRouter } from "react-router-dom";
import { GeoJsonObject } from "geojson";
import CountryTab from "./components/CountryTab";

export enum MapActionType {
  SETYEAR = "SETYEAR",
  SETGEODATA = "SETGEODATA",
  SETAREA = "SETAREA",
}

export interface MapAction {
  type: MapActionType;
  selectedYear?: TimeLineData | null;
  geoJsonData?: GeoJsonObject | null;
  selectedArea?: string | null;
}

export interface TimeLineData {
  year: string;
  data: string;
}

export interface MapState {
  selectedYear: TimeLineData | null;
  geoJsonData: GeoJsonObject | null;
  selectedArea: string | null;
}

const mapReducer = (state: MapState, action: MapAction) => {
  switch (action.type) {
    case MapActionType.SETYEAR: {
      return action.selectedYear
        ? {
            ...state,
            selectedYear: action.selectedYear,
          }
        : state;
    }
    case MapActionType.SETGEODATA: {
      return action.geoJsonData
        ? {
            ...state,
            geoJsonData: action.geoJsonData,
          }
        : state;
    }
    case MapActionType.SETAREA: {
      console.log(1);
      return action.selectedArea
        ? {
            ...state,
            selectedArea: action.selectedArea,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};

const initialMapData: MapState = {
  selectedYear: null,
  geoJsonData: null,
  selectedArea: null,
};

function App() {
  const [mapData, dispatch] = useReducer(mapReducer, initialMapData);

  return (
    <React.Fragment>
      <BrowserRouter>
        <Map mapData={mapData} dispatch={dispatch}></Map>
        <TimeLine mapData={mapData} dispatch={dispatch}></TimeLine>
        <CountryTab mapData={mapData} dispatch={dispatch}></CountryTab>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
