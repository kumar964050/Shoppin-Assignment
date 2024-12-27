const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const normalizeUrl = (url, baseUrl) => {
  try {
    const normalized = new URL(url, baseUrl);
    if (normalized.pathname.endsWith("/")) {
      normalized.pathname = normalized.pathname.slice(0, -1);
    }
    return normalized.href.toLowerCase();
  } catch (e) {
    console.error(`Invalid URL: ${url}`);
    return null;
  }
};

// specify the URL of the site to crawl
const targetUrl = "https://www.scrapingcourse.com/ecommerce/";

// high-priority and low-priority queues
let highPriorityQueue = [targetUrl];
let lowPriorityQueue = [targetUrl];

// define the desired crawl limit
const maxCrawlLength = 20;

// to store scraped product data
const productData = [];

// track visited URLs with a set
const visitedUrls = new Set();

// create a new Axios instance
const axiosInstance = axios.create();

// define a crawler function
const crawler = async () => {
  // define a regex that matches the pagination pattern
  const pagePattern = /page\/\d+/i;
  for (
    ;
    (highPriorityQueue.length > 0 || lowPriorityQueue.length > 0) &&
    visitedUrls.size <= maxCrawlLength;

  ) {
    // check for URLs in high-priority queue first
    if (highPriorityQueue.length > 0) {
      currentUrl = highPriorityQueue.shift();
    } else {
      // otherwise, get the next URL from the low-priority queue
      currentUrl = lowPriorityQueue.shift();
    }
    // normalize the URLs to an absolute path
    const normalizedUrl = normalizeUrl(currentUrl, targetUrl);
    if (!normalizedUrl || visitedUrls.has(normalizedUrl)) continue;

    // update the visited URLs set
    visitedUrls.add(normalizedUrl);

    try {
      // request the target URL with the Axios instance
      const response = await axiosInstance.get(normalizedUrl);
      // parse the website's HTML
      const $ = cheerio.load(response.data);

      // find all links on the page
      const linkElements = $("a[href]");
      linkElements.each((index, element) => {
        let url = $(element).attr("href");

        // normalize the URLs as they're crawled
        const absoluteUrl = normalizeUrl(url, targetUrl);

        // follow links within the target website
        if (
          absoluteUrl &&
          absoluteUrl.startsWith(targetUrl) &&
          !visitedUrls.has(absoluteUrl) &&
          !highPriorityQueue.includes(absoluteUrl) &&
          !lowPriorityQueue.includes(absoluteUrl)
        ) {
          // prioritize paginated pages
          if (pagePattern.test(absoluteUrl)) {
            highPriorityQueue.push(absoluteUrl);
          } else {
            lowPriorityQueue.push(absoluteUrl);
          }
        }
      });

      // extract product information from product pages only
      if (pagePattern.test(normalizedUrl)) {
        // retrieve all product containers
        const productContainers = $(".product");

        // iterate through the product containers to extract data
        productContainers.each((index, product) => {
          const data = {};

          data.url =
            $(product).find(".woocommerce-LoopProduct-link").attr("href") ||
            "N/A";
          data.image = $(product).find(".product-image").attr("src") || "N/A";
          data.name = $(product).find(".product-name").text().trim() || "N/A";
          data.price = $(product).find(".price").text().trim() || "N/A";

          // append the scraped data to the empty array
          productData.push(data);
        });
      }
    } catch (error) {
      console.error(`Error fetching ${currentUrl}: ${error.message}`);
    }
  }

  // write productData to a CSV file
  const header = "Url,Image,Name,Price\n";
  const csvRows = productData
    .map((item) => `${item.url},${item.image},${item.name},${item.price}`)
    .join("\n");
  const csvData = header + csvRows;

  fs.writeFileSync("products.csv", csvData);
  console.log("CSV file has been successfully created!");
};

// execute the crawler function
crawler();
