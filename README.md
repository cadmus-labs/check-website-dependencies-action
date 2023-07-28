# Check Dependencies Action

This action uses the website oracle to check the dependencies of a website. It will fail if any of the dependencies are broken so that you can detect them before end users are affected by them. This action currently supports the following dependency types.

- `page` - Links to other pages which user can navigate to
- `script` - Links to script files
- `stylesheet` - Links to stylesheets

Website Oracle can start at a page of your choice and scrape through your website, moving from one page to another, to ensure that links are not broken.

## Inputs

| Input          | Description                                                                                                           | Default Value                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `apiKey`       | [API Key for Website Oracle](https://rapidapi.com/cadmus-labs-cadmus-labs-admin/api/website-oracle/)                  | N/A (Required)                        |
| `url`          | The URL where the dependency analysis should start                                                                    | N/A (Required)at                      |
| `maxDepth`     | The maximum number of times the dependencies should be fetched recursively (The maximum depth of the dependency tree) | `1`                                   |
| `includeTypes` | The types of dependencies to analyze as a comma seperated list. It should be one of (`page`, `script`, `stylesheet`)  | All types                             |
| `config`       | The path to the config JSON file, relative to the repository root                                                     | `.github/actions/website-oracle.json` |

Website Oracle is currently available through [Rapid API](https://rapidapi.com/cadmus-labs-cadmus-labs-admin/api/website-oracle/). Subscribe to the API and get a token from Rapid API which can be used to call the Website Oracle.

## Configuration File

The configuration file should contain a JSON object with the fields.

| Field         | Type                                                | Default Value |
| ------------- | --------------------------------------------------- | ------------- |
| `scrapeRules` | Array of [Scrape Rule](#scrape-rule-config) objects | `[]`          |

**Example:**

```json
{
  "scrapeRules": [
    {
      "urlMatch": {
        "value": " https://www.googletagmanager.com/gtag/js?id=.*",
        "type": "regex"
      },
      "action": "ignore"
    }
  ]
}
```

### Scrape Rule Config

The scrape rule configuration object should contain JSON objects with the following fields.

| Field      | Description                                 | Default Value  |
| ---------- | ------------------------------------------- | -------------- |
| `urlMatch` | [URL Match](#url-match-config) object       | N/A (Required) |
| `action`   | One of `ignore`, `checkStatusOnly` `scrape` | `ignore`       |

The action values should be specified based on what you wish to do when a URL is matched by this rule.

- `ignore` - Ignore the URL completely without even checking the status.
- `checkStatusOnly` - Check the status of the URL, but do not get the dependencies of the URL itself.
- `scrape` - Check the status of the URL and then continue scraping of the dependencies of the URL (subject to `maxDepth` and `includeTypes`).

### URL Match Config

The URL match configuration object should contain JSON objects with the following fields.

| Field   | Type                                                         | Default Value  |
| ------- | ------------------------------------------------------------ | -------------- |
| `value` | The exact URL or the Regex depending on the URL match `type` | N/A (Required) |
| `type`  | One of `exact`, `regex`                                      | `exact`        |

The URL match type should be specified based on what you wish to do when a URL is tested against a rule.

- `exact` - The `value` should match exactly to the URL
- `regex` - The `value` is used as a regular expression to test the URL for a string match

## Examples

Please us the `<VERSION>` with the exact version tag you wish to use.

```yaml
name: Check Dependencies

on:
  workflow_run:
    workflows:
      - pages-build-deployment
    types:
      - completed
  schedule:
    - cron: 0 0 * * SUN

jobs:
  check-dependencies:
    runs-on: ubuntu-latest
    name: Check Dependencies
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3
      - name: Check Dependencies
        uses: cadmus-labs/check-website-dependencies-action@<VERSION>
        with:
          apiKey: ${{ secrets.WEBSITE_ORACLE_API_KEY }}
          url: "https://cadmus-labs.github.io/"
```
