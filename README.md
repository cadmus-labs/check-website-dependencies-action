# Check Dependencies Action

This action uses the website oracle to check the dependencies of a website. It will fail if any of the dependencies are broken so that you can detect them before end users are affected by them. This action currently supports the following dependency types.

- `page` - Links to other pages which user can navigate to
- `script` - Links to script files
- `stylesheet` - Links to stylesheets

Website Oracle can start at a page of your choice and scrape through your website, moving from one page to another, to ensure that links are not broken.

### Inputs

| Input          | Description                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| `apiKey`       | [API Key for Website Oracle](https://rapidapi.com/cadmus-labs-cadmus-labs-admin/api/website-oracle/)                 |
| `url`          | The URL where the dependency analysis should start at                                                                |
| `maxDepth`     | The maximum number of times the dependencies should be fetched recursively                                           |
| `includeTypes` | The types of dependencies to analyze as a comma seperated list. It should be one of (`page`, `script`, `stylesheet`) |

Website Oracle is currently available through [Rapid API](https://rapidapi.com/cadmus-labs-cadmus-labs-admin/api/website-oracle/). Subscribe to the API and get a token from Rapid API which can be used to call the Website Oracle.
