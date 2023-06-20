const baseUrl = "https://api.data.gov.sg/v1/transport/traffic-images/";
const apiKey = "AIzaSyDQIbcjA68smmxedDNZupW3_4US9kHBZlA";

const getLatLon = () => {
  fetch(baseUrl)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Unable to fetch traffic image data");
      }
    })
    .then((data) => {
      const testData = data.items[0].cameras;
      const getLocationPromises = testData.map((element) => {
        const testLat = element.location.latitude;
        const testLon = element.location.longitude;
        console.log(testLat, testLon);
        return getLocationName(testLat, testLon);
      });

      Promise.all(getLocationPromises)
        .then((locationNames) => {
          console.log(locationNames);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      Promise.all(getLocationPromises)
        .then((locationNames) => {
          populateLocationDropdown(locationNames);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const getTrafficImg = () => {
  fetch(baseUrl)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Unable to fetch traffic image data");
      }
    })
    .then((data) => {
      const trafficDatas = data.items[0].cameras[0];
      const testData = data.items[0].cameras;
      testData.forEach((element) => {
        const testLat = element.location.latitude;
        const testLon = element.location.longitude;

        getLocationName(testLat, testLon);
      });
      const latitude = trafficDatas.location.latitude;
      const longitude = trafficDatas.location.longitude;
      console.log(data);
      // Call the function to get the location name using reverse geocoding
      getLocationName(latitude, longitude);

      const image = document.querySelector("#image");
      const img = document.createElement("img");
      img.setAttribute("id", "img");
      img.src = trafficDatas.image;
      img.alt = trafficDatas.camera_id;
      image.appendChild(img);

      const timeStamp = document.querySelector("#timeStamp");
      const time = document.createElement("p");
      time.textContent =
        "Image taken on: " + formatDateTime(trafficDatas.timestamp);
      timeStamp.appendChild(time);
      // Load the Google Maps JavaScript API asynchronously
      loadMapScript(latitude, longitude);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Function to fetch the location name using reverse geocoding
// const getLocationName = (latitude, longitude) => {
//   // Create the geocoding API URL
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

//   // Fetch the location data
//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       const locationResult = data.results[0];
//       if (locationResult) {
//         const locationName = locationResult.formatted_address;
//         const locationElement = document.getElementById("location");
//         locationElement.textContent = "Location: " + locationName;
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching location data:", error);
//     });
// };

const getLocationName = (latitude, longitude) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const locationResult = data.results[0];
      if (locationResult) {
        const locationName = locationResult.formatted_address;
        const locationElement = document.getElementById("location");
        locationElement.textContent = "Location: " + locationName;
        return locationName;
      }
    })
    .catch((error) => {
      console.error("Error fetching location data:", error);
    });
};

// Load the Google Maps JavaScript API asynchronously
const loadMapScript = (latitude, longitude) => {
  // Create a script element
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  script.defer = true;
  script.async = true;

  // Attach an event listener to check if the script has been loaded
  script.addEventListener("load", () => {
    initMap(latitude, longitude);
  });

  // Append the script element to the document's head
  document.head.appendChild(script);
};

// Initialize the map
window.initMap = (latitude, longitude) => {
  const location = { lat: latitude, lng: longitude };
  const mapOptions = {
    center: location,
    zoom: 15,
  };

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // Add a marker to the map
  new google.maps.Marker({
    position: location,
    map: map,
  });
};

function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);

  // Extract date components
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1; // Months are zero-based
  const day = dateTime.getDate();

  // Extract time components
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();

  // Format the date and time string
  const formattedDateTime = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedDateTime;
}

// Function to populate the location dropdown
const populateLocationDropdown = (locations) => {
  const locationDropdown = document.getElementById("locationDropdown");

  // Clear existing options
  locationDropdown.innerHTML = "";

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select a location";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  locationDropdown.appendChild(defaultOption);

  // Add options for each location
  locations.forEach((location) => {
    const option = document.createElement("option");
    option.textContent = location;
    locationDropdown.appendChild(option);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getTrafficImg();
  getLatLon();
});
