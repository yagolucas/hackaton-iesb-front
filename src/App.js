import * as React from "react";
import "./App.css";
import Logo from "./assets/iesb.png";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import { useRunning } from "./services/running-service";

const MyMapComponent = withScriptjs(
  withGoogleMap((props) => {
    const { array, clear } = props;

    const handleShowMark = React.useMemo(() => {
      let initLat = array[0].latitude;
      let initLong = array[0].longitude;
      let newArray = [{ latitude: initLat, longitude: initLong }];
      let count = 0;
      for (let { latitude, longitude } of array) {
        count++;
        if (
          (initLat !== latitude || initLong !== longitude) &&
          count % 10 === 0
        ) {
          initLat = latitude;
          initLong = longitude;
          newArray.push({ latitude, longitude });
        }
      }
      return newArray.map(({ latitude, longitude }, index) => (
        <React.Fragment key={index}>
          <Marker position={{ lat: latitude, lng: longitude }} />
        </React.Fragment>
      ));
    }, [array]);

    if (clear) {
      return <React.Fragment />;
    }

    return (
      <GoogleMap
        defaultZoom={18}
        defaultCenter={{ lat: array[0].latitude, lng: array[0].longitude }}
      >
        {handleShowMark}
      </GoogleMap>
    );
  })
);

export function App() {
  const { getRotas, data, loading } = useRunning();

  const [selected, setSelected] = React.useState(-1);
  const [clear, setClear] = React.useState(false);

  const showOptions = React.useMemo(() => {
    if (!data) {
      return <React.Fragment />;
    }
    let datas = [];
    for (let { date } of data) {
      datas.push(date.split("T")[0]);
    }
    return datas.map((ele, ind) => (
      <React.Fragment key={ele}>
        <option value={ind}>{ele}</option>
      </React.Fragment>
    ));
  }, [data]);

  return (
    <div className="main">
      <div className="lg-wp">
        <img src={Logo} alt="logo do iesb" />
        <p>Hackaton de IA da Pós graduação do iesb</p>
        <button disabled={loading} onClick={() => getRotas()}>
          visualizar dados
        </button>
        <button onClick={() => setClear(true)}>limpar mapa</button>
        {data !== null && (
          <React.Fragment>
            <p>Selecione uma corrida</p>
            <select onChange={(e) => setSelected(e.target.value)}>
              <option value={-1}>Selecione</option>
              {showOptions}
            </select>
            {selected !== -1 && (
              <MyMapComponent
                clear={clear}
                array={data[selected].values}
                isMarkerShown={true}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBMU0wTfdss_x9etOFViRbdZb7OrmWtZrw&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={
                  <div style={{ height: `400px`, width: "90vw" }} />
                }
                mapElement={<div style={{ height: `100%` }} />}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
