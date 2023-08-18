import React, {
  Dispatch,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./CountryTab.scss";
import { Back, gsap } from "gsap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { MapAction, MapActionType, MapState } from "../App";
import { getCountryByName } from "../hooks";
import LoadingPage from "./LoadingPage";

// country map info sidebar
interface Props {
  mapData: MapState;
  dispatch: Dispatch<MapAction>;
}

export default function CountryTab(props: Props) {
  const { selectedArea, selectedYear } = props.mapData;
  const { dispatch } = props;
  const container = useRef<any>(null);
  const [simplified, setSimplified] = useState(true);
  const [mapInfo, setMapInfo] = useState<{
    findCountry: boolean;
    description?: string;
    extract?: string;
  } | null>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getCountryByName(selectedArea, setMapInfo, setLoading);
    console.log(mapInfo);
  }, [selectedArea]);

  useEffect(() => {
    setMapInfo(null);
    console.log("begin");
    dispatch({
      type: MapActionType.SETAREA,
      selectedArea: "Click a highlight area to select country",
    });
  }, [selectedYear?.year]);
  return (
    <div
      ref={container}
      className={`country_container ${simplified ? "simplified" : ""}`}
    >
      {!loading ? (
        simplified ? (
          <React.Fragment>
            <div className="flag_container">{selectedYear?.year}</div>
            <div className="country_name">{selectedArea}</div>
            <div className="icon_container">
              <ExpandMoreIcon
                onClick={() => {
                  setSimplified(!simplified);
                }}
              ></ExpandMoreIcon>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {mapInfo ? (
              mapInfo.findCountry ? (
                <React.Fragment>
                  <div className="title">{selectedArea}</div>
                  <div className="description">{mapInfo.description}</div>
                  <div className="extract">{mapInfo.extract}</div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="no_info">
                    <span>
                      Sorry, can't find this country information on Wikipedia,
                      if you want to edit this page or have good ideas, please
                      contact me.
                    </span>
                  </div>
                </React.Fragment>
              )
            ) : (
              <React.Fragment>
                <div className="no_info">
                  Click a highlight area to select country
                </div>
              </React.Fragment>
            )}
            <div className="icon_container">
              <ExpandLessIcon
                onClick={() => {
                  setSimplified(!simplified);
                }}
              ></ExpandLessIcon>
            </div>
          </React.Fragment>
        )
      ) : (
        <div className="spinner_container">
          <LoadingPage></LoadingPage>
        </div>
      )}
    </div>
  );
}
