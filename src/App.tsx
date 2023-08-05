import React from "react";
import { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import TimeLine from "./components/TimeLine";
import { BrowserRouter } from "react-router-dom";
import { GeoJsonObject } from "geojson";
import Carousel from "./components/Carousel";

interface TimeLineData {
  year: string;
  data: string;
}
function App() {
  const [selectedYear, setSelectedYear] = useState<TimeLineData | null>(null);
  const [geoData, setGeoData] = useState<GeoJsonObject>({
    type: "Feature",
  });
  return (
    <React.Fragment>
      <BrowserRouter>
        <Map
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          geoJsonData={geoData}
          setGeoData={setGeoData}
        ></Map>
        <TimeLine
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setGeoData={setGeoData}
        ></TimeLine>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
