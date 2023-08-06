import React, { Dispatch } from "react";
import { GeoJsonObject } from "geojson";

import tlData from "../data/TimeLineData.json";
import { MapAction, MapActionType } from "../App";

interface TimeLineData {
  year: string;
  data: string;
}

interface Props {
  dispatch: Dispatch<MapAction>;
  year: string;
  offwidth: number;
  move: (offwidth: number) => void;
  selectedYear: TimeLineData | null;
  // setSelectedYear: React.Dispatch<React.SetStateAction<TimeLineData | null>>;
}

export default function YearList(props: Props) {
  const { year, offwidth, move, selectedYear, dispatch } = props;
  const setSelectedYear = (year: TimeLineData) => {
    dispatch({
      type: MapActionType.SETYEAR,
      selectedYear: year,
      geoJsonData: null,
    });
  };
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
