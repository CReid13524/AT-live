import { useState } from "react";
import {
  MapStyle,
  ROUTE_LAYER_CONTROLS,
  STOP_LAYER_CONTROLS,
  TimeOfDay,
  VEHICLE_LAYER_CONTROLS,
  type LayerFilter,
  type MapAppearance,
  type LayerControls
} from "../types/types";
import { FaMap, FaAngleDown, FaAngleUp  } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import classNames from "classnames";

type MapControlProps = {
  appearance: MapAppearance
  setAppearance: (appearance: MapAppearance) => void
  layerControls: LayerControls
  layerControlRefresh: () => void
}

function MapControl(props: MapControlProps) {
  const [, forceUpdate] = useState(0);
  const [open, setOpen] = useState(false);
  const [stylePanelOpen, setStylePanelOpen] = useState(true);
  const [layerPanelOpen, setLayerPanelOpen] = useState(true);

  const {
    appearance,
    setAppearance,
    layerControls: {
      vehicles: vehicleLayerControls,
      stops: stopLayerControls,
      routes: routeLayerControls
    },
    layerControlRefresh
  } = props;

  const getIsChecked = (layerControls: React.RefObject<LayerFilter>, layerId?: string): boolean | undefined => {
    if (!layerControls.current) return;
    let checked = layerControls.current[layerId || ''];

    if (!layerId) {
      checked = Object.values(layerControls.current).every(value => value === true);
    }

    return checked;
  }

  const handleCheckboxChange = (layerControls: React.RefObject<LayerFilter>, layerId?: string) => {
    if (!layerControls.current) return;

    if (layerId) {
      layerControls.current[layerId] = !layerControls.current[layerId];
    } else {
      Object.keys(layerControls.current).forEach((key) => {
        layerControls.current![key] = !layerControls.current![key];
      });
    }
    forceUpdate(prev => prev + 1);
    layerControlRefresh();
  }

  return (
    <>
      <div
      className={classNames("map-style-panel", {
        "expanded": open
      })}
      >
        <div className="panel-header icon" onClick={() => setOpen(v => !v)}>
          {open ? <FaXmark /> : <FaMap />}
        </div>

        <section className="panel-section">
          <span className="panel-header hover" onClick={() => setStylePanelOpen(v => !v)}>
            {stylePanelOpen ? <FaAngleDown /> : <FaAngleUp />}
            <h3>Map Style</h3>
          </span>

          { stylePanelOpen && (
            <div className="pill-group">
              {Object.entries(MapStyle).map(([label, value]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="style"
                    checked={appearance.style === value}
                    onChange={() => setAppearance({ ...appearance, style: value })}
                  />
                  <span className={appearance.style === value ? "active" : ""}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="panel-section">

          <span className="panel-header hover" onClick={() => setLayerPanelOpen(v => !v)}>
            {layerPanelOpen ? <FaAngleDown /> : <FaAngleUp />}
            <h3>Layers</h3>
          </span>

          { layerPanelOpen && (
            <div className="layer-controls">

              <div className="layer-group">
                <div className="checkbox-row">
                  <input
                      type="checkbox"
                      checked={getIsChecked(vehicleLayerControls)}
                      onChange={() =>
                        handleCheckboxChange(vehicleLayerControls)
                      }
                    />
                  <h4>Vehicles</h4>
                </div>

                {Object.entries(VEHICLE_LAYER_CONTROLS).map(([layerId]) => (
                  <label key={layerId} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={getIsChecked(vehicleLayerControls, layerId)}
                      onChange={() =>
                        handleCheckboxChange(vehicleLayerControls, layerId)
                      }
                    />
                    <span>{layerId}</span>
                  </label>
                ))}
              </div>

              <div className="layer-group">
                <div className="checkbox-row">
                  <input
                      type="checkbox"
                      checked={getIsChecked(stopLayerControls)}
                      onChange={() =>
                        handleCheckboxChange(stopLayerControls)
                      }
                    />
                  <h4>Stops</h4>
                </div>

                {Object.entries(STOP_LAYER_CONTROLS).map(([layerId]) => (
                  <label key={layerId} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={getIsChecked(stopLayerControls, layerId)}
                      onChange={() =>
                        handleCheckboxChange(stopLayerControls, layerId)
                      }
                    />
                    <span>{layerId}</span>
                  </label>
                ))}
              </div>

              <div className="layer-group">
                <div className="checkbox-row header">
                  <input
                      type="checkbox"
                      checked={getIsChecked(routeLayerControls)}
                      onChange={() =>
                        handleCheckboxChange(routeLayerControls)
                      }
                    />
                  <h4>Routes</h4>
                </div>

                {Object.entries(ROUTE_LAYER_CONTROLS).map(([layerId]) => (
                  <label key={layerId} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={getIsChecked(routeLayerControls, layerId)}
                      onChange={() =>
                        handleCheckboxChange(routeLayerControls, layerId)
                      }
                    />
                    <span>{layerId}</span>
                  </label>
                ))}
              </div>

            </div>
          )}

        </section>

        {appearance.style === MapStyle.Standard && (
          <section className="panel-section">

            <h3>Map Appearance</h3>

            <div className="pill-group">
              {Object.entries(TimeOfDay).map(([label, value]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="time"
                    checked={appearance.timeOfDay === value}
                    onChange={() => setAppearance({ ...appearance, timeOfDay: value })}
                  />
                  <span className={appearance.timeOfDay === value ? "active" : ""}>
                    {label}
                  </span>
                </label>
              ))}
            </div>

            <div className="switch-grid">

              <label className="switch-row">
                <span>POI Labels</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={appearance.labels.poi}
                    onChange={() =>
                      setAppearance({ ...appearance, labels: { ...appearance.labels, poi: !appearance.labels.poi } })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </label>

              <label className="switch-row">
                <span>Road Labels</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={appearance.labels.roads}
                    onChange={() =>
                      setAppearance({ ...appearance, labels: { ...appearance.labels, roads: !appearance.labels.roads } })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </label>

              <label className="switch-row">
                <span>Place Labels</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={appearance.labels.places}
                    onChange={() =>
                      setAppearance({ ...appearance, labels: { ...appearance.labels, places: !appearance.labels.places } })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </label>

              <label className="switch-row">
                <span>Transit Labels</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={appearance.labels.transit}
                    onChange={() =>
                      setAppearance({ ...appearance, labels: { ...appearance.labels, transit: !appearance.labels.transit } })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </label>

            </div>

          </section>
        )}
      </div>
    </>
  );
}



export default MapControl;
