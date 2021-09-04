import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyDJp0QqS_TW9iGN1Q_B-WmT5thAULg-9MY";

type GoogleGeoCordingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

//declare var google: any;

// ハンドラー
function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;
  console.log(enteredAddress);

  axios
    .get<GoogleGeoCordingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("Could not get coordinates.");
      }
      const coordinates = response.data.results[0].geometry.location;

      // mapの追加
      const map = new google.maps.Map(
        document.getElementById("map")! as HTMLElement,
        {
          center: coordinates,
          zoom: 16,
        }
      );

      // makerの追加
      new google.maps.Marker({
        position: coordinates,
        map: map,
      });

      console.log(response);
      console.log(coordinates);
    })
    .catch((err) => {
      //　エラー、httpレスポンスコードがエラーの際に呼ばれる
      alert("Error.");
      console.log(err);
    });

  // fetch('').then((res) => {
  //     console.log(res);

  // })
}

// イベントリスナー
form.addEventListener("submit", searchAddressHandler);
