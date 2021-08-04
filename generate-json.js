// npm install @fast-csv/parse

const fs = require("fs");
const { parse } = require("@fast-csv/parse");

let currentEvent = null,
    eventInfo = {},
    currentScope = null,
    allEvents = [];

const writeEvent = () => {
  allEvents.push(eventInfo);
};

const stream = parse({ delimiter: ',' })
    .on('error', error => console.error(error))
    .on('data', row => {
      // console.log(row);
      let info = row[0].toLowerCase().trim();
      if (!info) {
        if (["description", "about"].includes(currentScope) && row[1].trim().length) {
          eventInfo[currentScope] += `<p>${row[1].trim()}</p>`;
        }
      } else {
        currentScope = info;

        if (info === "event") {
          if (currentEvent) {
            writeEvent();
            eventInfo = {};
          }

          currentEvent = row[1].toLowerCase().trim();
        } else if (info === "state") {
          eventInfo.state = row[1].trim();
          // todo: check for valid state name
        } else if (info === "module") {
          eventInfo.module = row[1].toLowerCase().trim();
        } else if (info === "description") {
          currentScope = "description";
          eventInfo.description = `<p>${row[1].trim()}</p>`;
        } else if (info === "about") {
          currentScope = "about";
          eventInfo.about = `<p>${row[1].trim()}</p>`;
        } else if (info === "hybrid") {
          eventInfo.hybrid = true;
        } else if (info === "coi") {
          eventInfo.coi = true;
        } else if (info === "partner-a-link") {
          eventInfo.coi = row[1].trim();
        } else if (info === "partner-a-image") {
          eventInfo.coi = row[1].trim();
        } else if (info === "partner-a-color") {
          eventInfo.coi = row[1].trim();
        } else if (info === "partner-b") {
          eventInfo.partnerB = row[1].trim();
        }
      }
    })
    .on('end', (rowCount) => {
      // console.log(`Parsed ${rowCount} rows`);
      if (currentEvent) {
        // write eventInfo
        writeEvent();
      }
      console.log(allEvents);
    });
stream.write(fs.readFileSync("./events.csv"));
stream.end();
