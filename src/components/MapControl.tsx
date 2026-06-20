import { MapStyle, TimeOfDay, type MapStyleType, type timeOfDayType } from '../types';

type MapControlProps = {
  open: boolean;
  mapStyle: MapStyleType;
  setMapStyle: (style: MapStyleType) => void;
  timeOfDay: timeOfDayType;
  setTimeOfDay: (time: timeOfDayType) => void;
  poiLabelVisible: boolean;
  setPOILabelVisible: (visible: boolean) => void;
  roadLabelVisible: boolean;
  setRoadLabelVisible: (visible: boolean) => void;
  placeLabelVisible: boolean;
  setPlaceLabelVisible: (visible: boolean) => void;
  transitLabelVisible: boolean;
  setTransitLabelVisible: (visible: boolean) => void;
}

function MapControl(props: MapControlProps) {
  const {
    open,
    mapStyle,
    setMapStyle,
    timeOfDay,
    setTimeOfDay,
    poiLabelVisible,
    setPOILabelVisible,
    roadLabelVisible,
    setRoadLabelVisible,
    placeLabelVisible,
    setPlaceLabelVisible,
    transitLabelVisible,
    setTransitLabelVisible
  } = props;

  return (
    <>
      {open && (
        <div className="map-style-panel">
          <p>Map style</p>
          <div className="section">
            {Object.entries(MapStyle)
              .map(([label, value]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="style"
                    checked={mapStyle === value}
                    onChange={() => setMapStyle(value)}
                  />
                  <p className={mapStyle === value ? "active" : ""}>{label}</p>
                </label>
              ))}
          </div>

          {mapStyle === MapStyle.Standard && (
            <>
              <p>Time of day</p>
              <div className="section">
                {Object.entries(TimeOfDay).map(([label, value]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="time"
                      checked={timeOfDay === value}
                      onChange={() => setTimeOfDay(value as any)}
                    />
                    <p className={timeOfDay === value ? "active" : ""}>{label}</p>
                  </label>
                ))}
              </div>
              <div className='switch-section'>
                <div>
                  <p>POI labels</p>
                  <label className="switch">
                    <input type='checkbox' checked={poiLabelVisible} onChange={() => setPOILabelVisible(!poiLabelVisible)}></input>
                    <span className="slider round"></span>
                  </label>
                </div>
                <div>
                  <p>Road labels</p>
                  <label className="switch">
                    <input type='checkbox' checked={roadLabelVisible} onChange={() => setRoadLabelVisible(!roadLabelVisible)}></input>
                    <span className="slider round"></span>
                  </label>
                </div>
                <div>
                  <p>Place labels</p>
                  <label className="switch">
                    <input type='checkbox' checked={placeLabelVisible} onChange={() => setPlaceLabelVisible(!placeLabelVisible)}></input>
                    <span className="slider round"></span>
                  </label>
                </div>
                <div>
                  <p>Transit labels</p>
                  <label className="switch">
                    <input type='checkbox' checked={transitLabelVisible} onChange={() => setTransitLabelVisible(!transitLabelVisible)}></input>
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
} 
 
export default MapControl;
