import React, { Component } from 'react';
import { subscribe } from 'mqtt-react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';

import './App.css';

const mapConfig = {
  url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
  attribution: '<a href="http://stamen.com">Stamen Design</a> | <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | HSL-map',
  center: [ 60.162, 24.688 ],
  zoomLevel: 14,
  style: { height: '100%' },
};

const RealtimeMarkers = ({ data }) => {
  const vehicles = data
    .map(item => item.VP)
    .filter(item => item.lat && item.long)
    .reduce((res, item) => {
      if (!res[item.veh] || item.tsi > res[item.veh].tsi) {
        res[item.veh] = item;
      }
      return res;
    }, {});

  if (vehicles) {
    return Object.values(vehicles).map(vehicle => {
      const iconSize = 26;
      const icon = divIcon({
        className: 'vehicle-marker',
        html: `<div style="background-color: black; font-size: ${iconSize*.45}px; line-height: ${iconSize}px;">${vehicle.desi}</div>`,
        style: {
          display: 'none',
        },
        iconAnchor: [iconSize/2, iconSize/2],
        iconSize: [iconSize, iconSize],
      });
      return (
        <Marker icon={icon} position={[vehicle.lat, vehicle.long]} key={vehicle.veh} />
      );
    });
  }

  return null;
}

class App extends Component {
  render() {


    return (
      <div className="app">
        <Map
          center={mapConfig.center}
          zoom={mapConfig.zoomLevel}
          style={mapConfig.style}
          fullscreenControl
        >
          <TileLayer url={mapConfig.url} attribution={mapConfig.attribution}/>
          <RealtimeMarkers data={this.props.data} />
        </Map>
      </div>
    );
  }
}

export default subscribe({
  topic: '/hfp/v1/journey/+/+/+/+/2157/+/#'
})(App);
