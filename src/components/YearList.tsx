import React, { Dispatch, useState } from "react";

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
}

export default function YearList(props: Props) {
  const { year, offwidth, move, selectedYear, dispatch } = props;
  const setSelectedYear = (year: TimeLineData) => {
    dispatch({
      type: MapActionType.SETYEAR,
      selectedYear: year,
    });
  };
  const getDataByYear = (year: string): string => {
    return tlData.timelineData.find((obj) => obj.year === year)?.data || "123";
  };

  return (
    <React.Fragment>
      <li>
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
      </li>
    </React.Fragment>
  );
}
