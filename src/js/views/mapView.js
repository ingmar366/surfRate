class MapView {
  #map;
  #mapZoomlevel = 12;

  #clearMap() {
    if (this.#map != undefined) {
      this.#map.remove();
    }
  }

  //ask browser for the current location of the user
  #getLocation() {
    //made a promise so it will wait for a response of the user before rendering the map
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
  }

  async setupMap() {
    //getting the location data and calling map function
    try {
      this.#clearMap();
      const response = await this.#getLocation();
      const { latitude, longitude } = response.coords;
      this.#loadMap([latitude, longitude], this.#mapZoomlevel);
    } catch (err) {
      console.log(err.message);
      this.#loadMap();
    }
  }

  #loadMap(latlng = [53.0, 9.0], z = 5) {
    //loading the map with default location or location given by browser
    return new Promise((res, rej) => {
      this.#map = L.map("map").setView(latlng, z);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);
    });
  }

  // displaying all the surfspots that are currently in the data obj
  displayMarkers(surfspots) {
    const arrSpots = Object.entries(surfspots.surfspot);
    arrSpots.forEach((i, ind) => {
      const curLat = i[1].location.lat;
      const curLng = i[1].location.long;
      L.marker([curLat, curLng])
        .addTo(this.#map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 150,
            autoClose: false,
            class: `spot-popup spot${ind}`,
            closeOnClick: false,
          })
        )
        .setPopupContent(`${i[1].location.name}`); // dummy text for spots
    });
  }

  // set the map to a given location, for example when a surfspot is clicked.
  setMapToLocation(spot) {
    if (!this.#map) return;
    // prefents error when a surfspot is clicked but there is not map loaded yet.
    const coords = [spot.location.lat, spot.location.long];
    this.#map.setView(coords, this.#mapZoomlevel);
  }

  // function for later determen where a new spot needs to be rendered
  addhandlerClickMap(handler) {
    // add eventhanlder click on the map
    this.#map.on(`click`, handler);
  }

  getMarkerPosition(mapE) {
    //   returning clicked position on the map
    const { lat, lng } = mapE.latlng;
    return [lat, lng];
  }
}

export default new MapView();