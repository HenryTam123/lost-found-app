import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useLoadScript, InfoWindow, InfoBox } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import CustomMarker from "./CustomMarker";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const bigContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 22.302711,
  lng: 114.177216,
};

const libraries = ["places"];

function MyMap({
  markerLatLng = {},
  markerAddress = null,
  setMarkerLatLng,
  setMarkerAddress,
  isViewOnlyMode,
  isViewAll = false,
  posts = {},
  post = {},
}) {
  //   const [markerLatLng, setMarkerLatLng] = useState([]);
  // const [markerAddress, setMarkerAddress] = useState("");
  const { isLoaded, loadError } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: libraries,
  });

  const onMapClick = useCallback(async (e) => {
    const result = await getGeocode({ location: { lat: e.latLng.lat(), lng: e.latLng.lng() } });

    setMarkerLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng(), time: new Date() });
    setMarkerAddress(result[0].formatted_address);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  });

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);

  // console.log(markerLatLng);
  console.log(isViewAll);

  if (loadError) return "Error Loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <>
      {isViewOnlyMode ? (
        !isViewAll ? (
          <GoogleMap
            mapContainerStyle={bigContainerStyle}
            center={post && post.latlng}
            zoom={16}
            // onClick={onMapClick}
            onLoad={onMapLoad}
          >
            {post.latlng && <CustomMarker position={post.latlng} />}
          </GoogleMap>
        ) : (
          <GoogleMap mapContainerStyle={bigContainerStyle} center={posts[0].latlng} zoom={16} onLoad={onMapLoad}>
            {posts.map((post) => {
              if (post.latlng) {
                return (
                  <>
                    <CustomMarker position={post.latlng}></CustomMarker>
                    <InfoWindow position={post.latlng} options={{ padding: "2px" }}>
                      <img src={post.imageUrls[0]} alt="" height={50} />
                    </InfoWindow>
                  </>
                );
              }
              return;
            })}
          </GoogleMap>
        )
      ) : (
        <>
          <Search
            panTo={panTo}
            markerAddress={markerAddress}
            setMarkerLatLng={setMarkerLatLng}
            setMarkerAddress={setMarkerAddress}
            post={post}
          />
          {markerLatLng && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerLatLng.lat ? markerLatLng : center}
              zoom={16}
              onClick={onMapClick}
              onLoad={onMapLoad}
            >
              {markerLatLng && <CustomMarker position={markerLatLng} />}
            </GoogleMap>
          )}
        </>
      )}
    </>
  );
}

function Search({ panTo, setMarkerLatLng, markerAddress, setMarkerAddress, post }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 22.302711, lng: () => 114.177216 },
      radius: 200 * 1000,
    },
  });

  return (
    <Combobox
      // onFocus={() => {
      //   if (markerAddress) {
      //     setValue(markerAddress, false);
      //     setMarkerAddress(null);
      //     clearSuggestions();
      //   }
      // }}
      onSelect={async (address) => {
        setValue(address, false);
        setMarkerAddress(address);
        clearSuggestions();
        try {
          const result = await getGeocode({ address });
          const { lat, lng } = await getLatLng(result[0]);
          panTo({ lat, lng });
          setMarkerLatLng({ lat, lng });
        } catch (err) {
          console.log(err);
        }
      }}
    >
      <ComboboxInput
        className="form-control mb-3"
        required
        id="marker_address"
        value={markerAddress || value}
        onChange={(e) => {
          setMarkerAddress(e.target.value);

          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Enter an address"
        autoComplete="off"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" && data.map(({ id, description }) => <ComboboxOption key={id} value={description} />)}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}

export default React.memo(MyMap);
