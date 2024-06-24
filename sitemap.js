import * as cheerio from "cheerio";
import axios from "axios";
import { parseArgs } from "node:util";
import { existsSync, mkdirSync, writeFile } from "node:fs";

const MAIN_DOMAIN = "https://golarion.altervista.org/wiki";

axios.defaults.baseURL = MAIN_DOMAIN;
axios.defaults.headers["User-Agent"] =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";

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

  if (axiosResponse.status !== 200) {
    const error = new Error(
      `invalid status ${axiosResponse.status} for URL ${url}`
    );
    error.httpStatus = axiosResponse.status;
    throw error;
  }

  // parsing the HTML source of the target web page with Cheerio
  const $ = cheerio.load(axiosResponse.data);

  const mainContent = $("#main-section");

  return getInsideLinks(mainContent, $);
}

/**
 * Given a container, found its first title and the thumbnail
 *
 * @param {cheerio.Cheerio<cheerio.Element>} context
 * @param {cheerio.Root} $
 */
function getInsideLinks(context, $) {
  const links = context.find("a");

  const list = [];

  links.each((index, element) => {
    const link = $(element).attr("href");

    if (!link) {
      return;
    }

    const url = new URL(link, MAIN_DOMAIN);

    if (!url.href.startsWith(MAIN_DOMAIN)) {
      return;
    }

    list.push(url.href);
  });

  return list;
}

/**
 * Main process
 */
async function main() {
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
    values: { url: inputUrl },
  } = parseArgs({ options });

  let queue = [inputUrl];
  const history = [];
  const invalids = [];

  const dir = "./output";

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  while (queue.length) {
    let url = queue.shift();

    console.clear();

    console.table([
      ["Done", history.length],
      ["Remaining", queue.length],
      ["Invalids", invalids.length],
    ]);

    if (!history.includes(url)) {
      console.info(`Processing ${url}`);

      try {
        const urls = await performScraping(url);

        console.info(`Found ${urls.length} URLs`);

        queue = [...queue, ...urls];

        history.push(url);
      } catch (error) {
        invalids.push({ url, httpStatus: error?.httpStatus });
        console.error(error);
      }
    } else {
      console.info(`Skipped ${url}`);
    }
  }

  writeFile(`${dir}/sitemap.json`, JSON.stringify(history), { flag: "w+" }, (err) => {
    if (err) throw err;
    console.log("The file 'sitemap.json' has been saved!");
  });

  writeFile(`${dir}/invalids.json`, JSON.stringify(invalids), { flag: "w+" }, (err) => {
    if (err) throw err;
    console.log("The file 'invalids.json' has been saved!");
  });
}

main();
