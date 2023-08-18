import React from "react";
import "./LoadingPage.scss";

interface Props {
  fullscreen?: boolean;
}

export default function LoadingPage(props: Props) {
  const { fullscreen } = props;

  return fullscreen ? (
    <div className="fullscreen_loader_container">
      <div className="loader fullscreen"></div>
    </div>
  ) : (
    <div className="loader"></div>
  );
}
