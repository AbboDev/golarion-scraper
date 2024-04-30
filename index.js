import axios from "axios";

const MAIN_DOMAIN = "https://golarion.altervista.org";

axios.defaults.baseURL = MAIN_DOMAIN;
axios.defaults.headers["User-Agent"] =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";

async function performScraping() {
  // downloading the target web page
  // by performing an HTTP GET request in Axios
  const axiosResponse = await axios.request({
    method: "GET",
    url: "/wiki/Pagina_principale",
  });

  console.debug(axiosResponse);
}

performScraping();
