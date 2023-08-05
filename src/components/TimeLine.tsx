import React, { useLayoutEffect, useRef, useEffect } from "react";
import "./TimeLine.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { GeoJsonObject } from "geojson";

import tlData from "../data/TimeLineData.json";
import YearList from "./YearList";

interface TimeLineData {
  year: string;
  data: string;
}
interface Props {
  selectedYear: TimeLineData | null;
  setSelectedYear: React.Dispatch<React.SetStateAction<TimeLineData | null>>;
  setGeoData: React.Dispatch<React.SetStateAction<GeoJsonObject>>;
}

const timeLineData: Array<TimeLineData> = tlData.timelineData;
gsap.registerPlugin(ScrollTrigger, Draggable);

export default function TimeLine({
  selectedYear,
  setSelectedYear,
  setGeoData,
}: Props) {
  const main = useRef(null);
  const track = useRef<HTMLDivElement>(null);
  const getPosition = (ref: Element) => {
    console.log(ref.getBoundingClientRect());
  };
  const move = (left: number) => {
    gsap.to(track.current, {
      x: () => {
        return left;
      },
    });
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const draggableInstance = Draggable.create(track.current, {
        type: "x",
        inertia: true,
        // onDragStart: () => st.disable(),
        // onDragEnd: () => st.enable(),
        // onDrag: () => console.log(track.current?.getBoundingClientRect().x),
        bounds: {
          minX: 0,
          maxX: -7500,
          // maxX: 0,
        },
        edgeResistance: 1, // Don’t allow any dragging beyond the bounds
      });
    }, main);
    return () => ctx.revert();
  }, []);
  const getGeoJsonData = async (url: string | undefined) => {
    console.log(url);
    if (!url) return;
    const res = await fetch(url);
    const geoJSONData: GeoJsonObject = await res.json();
    console.log(geoJSONData);
    setGeoData(geoJSONData);
  };
  useEffect(() => {
    getGeoJsonData(selectedYear?.data);
  }, [selectedYear]);
  return (
    <div className="timeline" ref={main}>
      <div className="marker"></div>
      <div className="year-tracker" data-draggable ref={track}>
        <ul className="year-list">
          {timeLineData.map((data, index) => (
            <YearList
              year={data.year}
              move={move}
              offwidth={-(17 + index * 160)}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              setGeoData={setGeoData}
              key={data.year}
            ></YearList>
          ))}
        </ul>
      </div>
    </div>
  );
}
