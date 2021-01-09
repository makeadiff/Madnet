import React from 'react'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps'
import StandaloneSearchBox from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'
// import Geocode from "react-geocode";
import { GOOGLE_MAPS_API_TOKEN } from '../utils/Constants'
import { map } from 'ionicons/icons'

// Geocode.setApiKey( GOOGLE_MAPS_API_TOKEN );

const MapContainer = withScriptjs(
  withGoogleMap((props) => {
    const [bounds, setBounds] = React.useState(null)
    const [center, setCenter] = React.useState({ lat: 41.9, lng: -87.624 })
    const [markers, setMarkers] = React.useState([])
    const google = window.google

    const refs = {}

    let onSearchBoxMounted = (ref) => {
      refs.searchBox = ref
    }

    let addMarker = (e) => {
      console.log(e)
      const marker = [{ position: e.latLng }]
      setMarkers(marker)
    }

    React.useEffect(() => {
      setCenter({ lat: props.coordinates.lat, lng: props.coordinates.lng })
    }, [props.coordinates])

    let onMarkerDragEnd = (e) => {
      let newLat = e.latLng.lat(),
        newLng = e.latLng.lng()

      let mapPositiion = {
        lat: newLat,
        lng: newLng
      }

      setCenter(mapPositiion)
      props.locationUpdate(e.latLng)
    }

    let onPlacesChanged = () => {
      const places = refs.searchBox.getPlaces()
      const bounds = new google.maps.LatLngBounds()

      places.forEach((place) => {
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport)
        } else {
          bounds.extend(place.geometry.location)
        }
      })
      const nextMarkers = places.map((place) => ({
        position: place.geometry.location
      }))

      // const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
      const nextCenter = nextMarkers[0].position
      const address = places[0].formatted_address

      setCenter(nextCenter)
      setMarkers(nextMarkers)
      props.locationUpdate(nextCenter, address)
      // refs.map.fitBounds(bounds);
    }

    return (
      <>
        <StandaloneSearchBox
          ref={onSearchBoxMounted}
          bounds={bounds}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Start typing your location..."
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              position: `absolute`,
              top: `0`,
              left: `0`,
              width: `100%`,
              height: `40px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              border: 'thin solid #CCC',
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`
            }}
          />
        </StandaloneSearchBox>

        <GoogleMap
          defaultZoom={15}
          center={center}
          onClick={addMarker}
          style={{
            position: `absolute`,
            top: `45px`,
            left: `0`
          }}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              draggable={true}
              onDragEnd={onMarkerDragEnd}
            />
          ))}
        </GoogleMap>
      </>
    )
  })
)

export default MapContainer
