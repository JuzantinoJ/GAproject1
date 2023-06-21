const baseUrl = "https://api.data.gov.sg/v1/transport/traffic-images/";
const apiKey = "";

// function to use data from data.gov.sg and google reverse geocode and create a new data
const createData = async () => {
  return fetch(baseUrl)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Unable to fetch traffic image data");
      }
    })
    .then(async (data) => {
      const cameraPromises = data.items[0].cameras.map((element) => {
        const testLat = element.location.latitude;
        const testLon = element.location.longitude;
        const image = element.image;
        const camera_id = element.camera_id;
        const time = element.timestamp;

        //getLocationName function returns a promise
        // wait for all the promises to resolve before returning the newData array
        return getLocationName(testLat, testLon)
          .then((locationName) => {
            return {
              locationName: locationName,
              location: { latitude: testLat, longitude: testLon },
              image: image,
              timestamp: time,
              camera_id: camera_id,
            };
          })
          .catch((error) => {
            console.error("Error fetching location name:", error);
            return null;
          });
      });

      return Promise.all(cameraPromises).then((newData) => {
        console.log(newData);
        return newData.filter((item) => item !== null);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Get location name using Google Reverse Geocoding.
const getLocationName = async (latitude, longitude) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const locationResult = data.results[0];
    if (locationResult) {
      const locationName = locationResult.formatted_address;
      return locationName;
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
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

// format time for when images were taken
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

const displayNewData = (newData) => {
  const dropdown = document.createElement("select");
  const defaultOption = document.createElement("option");
  defaultOption.text = "Select a location";
  dropdown.add(defaultOption);

  // Create options for each location
  newData.forEach((item) => {
    const locationName = item.locationName;
    const option = document.createElement("option");
    option.value = locationName;
    option.text = locationName;
    dropdown.add(option);
  });

  dropdown.addEventListener("change", (event) => {
    const selectedLocation = event.target.value;
    const selectedData = newData.find(
      (item) => item.locationName === selectedLocation
    );

    if (selectedData) {
      const locationElement = document.getElementById("location");
      locationElement.textContent = "Location: " + selectedLocation;

      const timeStampElement = document.getElementById("timeStamp");
      timeStampElement.textContent =
        "Timestamp: " + formatDateTime(selectedData.timestamp);

      const image = document.querySelector("#image");
      const img = document.createElement("img");
      img.setAttribute("id", "img");
      img.src = selectedData.image;
      img.alt = selectedData.camera_id;
      console.log("img.src:", img.src);
      image.innerHTML = "";
      image.appendChild(img);
    }
    loadMapScript(
      selectedData.location.latitude,
      selectedData.location.longitude
    );
    const map = document.querySelector("#map");
    map.innerHTML = "";
  });

  const dropdownContainer = document.getElementById("locationDropdown");
  dropdownContainer.appendChild(dropdown);
};
document.addEventListener("DOMContentLoaded", () => {
  createData()
    .then((data) => {
      displayNewData(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
