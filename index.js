import * as cheerio from "cheerio";
import axios from "axios";
import { parseArgs } from "node:util";

const MAIN_DOMAIN = "https://golarion.altervista.org/wiki";

axios.defaults.baseURL = MAIN_DOMAIN;
axios.defaults.headers["User-Agent"] =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";

/**
 * The arguments accepted by the CLI
 */
const options = {
  url: {
    type: "string",
    default: "/Pagina_principale",
  },
};

/**
 * The parsed arguments
 */
const {
  values: { url },
} = parseArgs({ options });

/**
 *
 */
async function performScraping(url) {
  // downloading the target web page
  // by performing an HTTP GET request in Axios
  const axiosResponse = await axios.request({
    method: "GET",
    url,
  });

  // parsing the HTML source of the target web page with Cheerio
  const $ = cheerio.load(axiosResponse.data);

  const mainContent = $("#main-body");
  const outputContent = mainContent.find(".mw-parser-output");

  console.debug(createPage(outputContent));
}

/**
 * Given a container, found its first title and the thumbnail
 *
 * @param {cheerio.Cheerio<cheerio.Element>} context
 */
function createPage(context) {
  const title = context.find("h1").text();
  const image = createImage(context.find(".image img"));

  return {
    title,
    image,
  };
}

/**
 * Given an image tag, return its attributes
 *
 * @param {cheerio.Cheerio<cheerio.Element>} img
 */
function createImage(img) {
  return {
    alt: img.attr("alt"),
    src: img.attr("src"),
    srcset: img.attr("srcset"),
  };
}

/**
 * Main process
 */
performScraping(url);
