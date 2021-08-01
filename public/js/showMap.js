console.log( campground.geometry.coordinates)
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: campground.geometry.coordinates, // starting position [lng, lat]
      zoom: 6 // starting zoom
  });

  new mapboxgl.Marker()
      .setLngLat(campground.geometry.coordinates)
      .setPopup(
          new mapboxgl.Popup({ offset: 25 })
              .setHTML(
              `<h6>${campground.title}</h6>`
          )
      )
  .addTo(map);
