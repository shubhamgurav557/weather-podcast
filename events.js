const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i");

let api;
// let apiKey = `8c771de5935c4a8c99b72325221011&q`;
let apiKey = `10e9c56df3718edff11a5ddf235bfea3`;

inputField.addEventListener("keyup", (e) => {
  //if user pressed enter and input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

function onSuccess(position) {
  debugger;
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    // pass values to HTML elements

    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    if (id == 800) {
      wIcon.src = "./assets/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "./assets/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "./assets/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "./assets/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "./assets/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 532)) {
      wIcon.src = "./assets/rain.svg";
    }

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    console.log(info);
  }
  console.log(info);
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
