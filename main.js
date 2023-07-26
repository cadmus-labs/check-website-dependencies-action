/*
 * Cadmus Labs - All Rights Reserved
 *
 * This source code and its associated files are the
 * confidential and proprietary information of Cadmus Labs.
 * Unauthorized reproduction, distribution, or disclosure
 * in any form, in whole or in part, is strictly prohibited
 * except as explicitly provided under a separate license
 * agreement with Cadmus Labs.
 *
 * Website: https://cadmus-labs.github.io
 *
 * © 2023 Cadmus Labs. All rights reserved.
 */

const core = require("@actions/core");
const http = require("@actions/http-client");

const websiteOracleHost = "website-oracle.p.rapidapi.com";

try {
  const apiKey = core.getInput("apiKey");
  const url = core.getInput("url");
  const maxDepth = parseInt(core.getInput("maxDepth"), 10);
  const includeTypes = core
    .getInput("includeTypes")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t !== "");

  const client = new http.HttpClient("website-oracle");
  const endpointUrl = "https://" + websiteOracleHost + "/dependencies";
  console.log("Sending request to Website Oracle (" + endpointUrl + ")");
  client
    .postJson(
      endpointUrl,
      {
        url: url,
        maxDepth: maxDepth,
        includeTypes: includeTypes,
      },
      {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": websiteOracleHost,
      },
    )
    .then((response) => {
      const apiStatusCode = response.statusCode;
      const urls = response.result?.urls;
      console.log(
        "Received response from Website Oracle (statusCode: " +
          apiStatusCode +
          ")",
      );
      if (
        (apiStatusCode - (apiStatusCode % 100)) / 100 === 2 &&
        urls !== undefined
      ) {
        console.log();
        var failedDependencies = 0;
        for (var i = 0; i < urls.length; i++) {
          const url = urls[i].url;
          const type = urls[i].type;
          const error = urls[i].error;
          const statusCode = urls[i].statusCode;

          if (error != undefined) {
            core.error(
              "❌ Failed to fetch dependency " +
                url +
                " of type " +
                type +
                ": " +
                error,
            );
            failedDependencies++;
          } else if (
            statusCode != undefined &&
            (statusCode - (statusCode % 100)) / 100 !== 2
          ) {
            core.error(
              "❌ Failed to fetch dependency " +
                url +
                " of type " +
                type +
                " with status code " +
                statusCode,
            );
            failedDependencies++;
          } else {
            console.log(
              "✅ Successfully fetched dependency " + url + " of type " + type,
            );
          }
        }
        if (failedDependencies > 0) {
          core.setFailed(
            "Fetching atleast one dependency (" +
              failedDependencies +
              ") failed",
          );
        }
      } else {
        core.setFailed(
          "Error response from Website Oracle: " +
            response.result?.errorMessage,
        );
      }
    })
    .catch((error) => {
      core.setFailed("Failed to call Website Oracle: " + error.message);
    });
} catch (error) {
  core.setFailed("Action execution failed: " + error.message);
}
