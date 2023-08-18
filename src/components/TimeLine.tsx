import React, {
  useLayoutEffect,
  useRef,
  useEffect,
  Dispatch,
  useState,
} from "react";
import "./TimeLine.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { GeoJsonObject } from "geojson";

import tlData from "../data/TimeLineData.json";
import YearList from "./YearList";
import { MapAction, MapActionType, MapState } from "../App";
import LoadingPage from "./LoadingPage";

interface TimeLineData {
  year: string;
  data: string;
}
interface Props {
  mapData: MapState;
  dispatch: Dispatch<MapAction>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const timeLineData: Array<TimeLineData> = tlData.timelineData;
gsap.registerPlugin(ScrollTrigger, Draggable);

export default function TimeLine({ mapData, dispatch, setIsLoading }: Props) {
  const { selectedYear } = mapData;
  const main = useRef(null);
  const track = useRef<HTMLDivElement>(null);
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

  const setGeoJsonData = (geoJsonData: GeoJsonObject) => {
    dispatch({
      type: MapActionType.SETGEODATA,
      geoJsonData: geoJsonData,
    });
  };
  const getGeoJsonData = async (url: string | undefined) => {
    if (!url) return;
    setIsLoading(true);
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const geoJSONData: GeoJsonObject = await res.json();
      setGeoJsonData(geoJSONData);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getGeoJsonData(process.env.PUBLIC_URL + selectedYear?.data);
  }, [selectedYear]);
  return (
    <div className="timeline" ref={main}>
      <div className="marker"></div>
      <div className="year-tracker" data-draggable ref={track}>
        <ul className="year-list">
          {timeLineData.map((data, index) => (
            <YearList
              year={data.year}
              dispatch={dispatch}
              move={move}
              offwidth={-(17 + index * 160)}
              selectedYear={selectedYear}
              // setSelectedYear={setSelectedYear}
              key={data.year}
            ></YearList>
          ))}
        </ul>
      </div>
    </div>
  );
}
