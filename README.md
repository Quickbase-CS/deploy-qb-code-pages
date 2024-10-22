# DEPLOY QB SCRIPTS FOR REACT JS

Simple overview of use/purpose.

## Description

This node script will enable the qb user to deploy their scripts directly to their qb pages.

## Getting Started

### Dependencies

- DEPLOYMENT_ENV : Requires deployment environmemt. Value should be 'prod' or 'dev'
- GITHUB_TOKEN: Requires GitHub Access Token. It can generated using secrets.GITHUB_TOKEN in github actions
- OWNER: Requires GitHub username or organisation name
- REPO_NAME: Requires GitHub repo name
- BRANCH: Requires GitHub branch name
- APP_TOKEN: Requires App Token from qb realm to be stored as env in repo as secrets
- USER_TOKEN: Requires User Token from qb realm to be stored as env in repo as secrets
- QBCLI_FOLDER_PATH: (Optinal) qbcli.json file path. If not specified it use the repository's root location

### Installing

- npm install -g deploy-qb-code-pages

### Executing program

- How to run the program

```
deploy-qb-code-pages
  GITHUB_TOKEN="$GITHUB_TOKEN"
  OWNER="$OWNER"
  REPO_NAME="$REPO_NAME"
  BRANCH="$BRANCH"
  APP_TOKEN="$APP_TOKEN"
  USER_TOKEN="$USER_TOKEN"
  DEPLOYMENT_ENV="$DEPLOYMENT_ENV"
  QBCLI_FOLDER_PATH = "$QBCLI_FOLDER_PATH"
```

## Help

Any advise for common problems or issues.

```
https://github.com/Quickbase-CS/deploy-qb-code-pages/issues
```

## Authors

Contributors names and contact info

ex. Akhilesh Sharma

## Version History

- 1.0.3
  - Various bug fixes and optimizations
  - See [commit change]() or See [release history]()
- 1.0.0
  - Initial Release

## License

This project is licensed under the [ISC] License - see the LICENSE.md file for details
