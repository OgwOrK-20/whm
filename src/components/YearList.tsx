import React, { useEffect } from "react";
import { gsap } from "gsap";
import { GeoJsonObject } from "geojson";

import tlData from "../data/TimeLineData.json";

interface TimeLineData {
  year: string;
  data: string;
}

interface Props {
  year: string;
  offwidth: number;
  move: (offwidth: number) => void;
  selectedYear: TimeLineData | null;
  setSelectedYear: React.Dispatch<React.SetStateAction<TimeLineData | null>>;
  setGeoData: React.Dispatch<React.SetStateAction<GeoJsonObject>>;
}

export default function YearList(props: Props) {
  const { year, offwidth, move, selectedYear, setSelectedYear, setGeoData } =
    props;
  const getDataByYear = (year: string): string => {
    return tlData.timelineData.find((obj) => obj.year === year)?.data || "123";
  };

  return (
    <React.Fragment>
      <li>
        <a>
          <span
            className={year === selectedYear?.year ? "selected_year" : ""}
            data-link
            onClick={() => {
              setSelectedYear({ year: year, data: getDataByYear(year) });
              move(offwidth);
            }}
          >
            {year}
          </span>
        </a>
      </li>
    </React.Fragment>
  );
}
