import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { render } from "react-dom";
import MapGL, { Source, Layer } from "@goongmaps/goong-map-react";
import ControlPanel from "./control-panel";

import { dataLayer, fillLayer } from "./map-style.js";
import { updatePercentiles } from "./utils";

const GOONG_MAPTILES_KEY = "pUhXgHuCZYAftRhPuN8q8icCOaynIICbUTBFyrDE"; // Set your goong maptiles key here

export default function App() {
  const [viewport, setViewport] = useState({
    // zoom at launch
    latitude: 16,
    longitude: 107,
    zoom: 5.5,
    bearing: 0,
    pitch: 0,
  });
  const [year, setYear] = useState(2015);
  const [allData, setAllData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    /* global fetch */
    fetch(
      // "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson"
      // "https://raw.githubusercontent.com/Vizzuality/growasia_calculator/master/public/vietnam.geojson"
      "https://data.opendevelopmentmekong.net/dataset/999c96d8-fae0-4b82-9a2b-e481f6f50e12/resource/2818c2c5-e9c3-440b-a9b8-3029d7298065/download/diaphantinhenglish.geojson"
    )
      .then((resp) => resp.json())
      .then((json) => setAllData(json));
  }, []);

  const onHover = useCallback((event) => {
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(
      hoveredFeature
        ? {
            feature: hoveredFeature,
            x: offsetX,
            y: offsetY,
          }
        : null
    );
    // console.log(hoverInfo);
  }, []);

  const data = allData;

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="https://tiles.goong.io/assets/goong_map_web.json"
        onViewportChange={setViewport}
        goongApiAccessToken={GOONG_MAPTILES_KEY}
        interactiveLayerIds={["data-fill", "data-line"]} // related to map-style.js
        onHover={onHover}
      >
        <Source type="geojson" data={data}>
          {/* 2 layers? */}
          <Layer {...fillLayer} />
          <Layer {...dataLayer} />
        </Source>
        {hoverInfo && (
          <div
            className="tooltip"
            style={{ left: hoverInfo.x, top: hoverInfo.y }}
          >
            <div>State: {hoverInfo.feature.properties.Name}</div>
            <div>Information:</div>
          </div>
        )}
      </MapGL>
    </>
  );
}

export function renderToDom(container) {
  render(<App />, container);
}
