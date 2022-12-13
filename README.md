# DEPLOY QB SCRIPTS FOR REACT JS

Simple overview of use/purpose.

## Description

This node script will enable the qb user to deploy their scripts directly to their qb pages.

## Getting Started

### Dependencies

- Git Access Token to be stored in github global settings
- Requires Git username
- Requires Git repo name
- Requires qbcli.json file to be stored in repo root location.
- Requires build folder to be stored in repo root location.
- Requires User Token from qb realm to be stored as env in repo as secrets
- Requires App Token from qb realm to be stored as env in repo as secrets

### Installing

- npm install -g deployqbforreact

### Executing program

- How to run the program
- Step-by-step bullets

```
deployqbforreact OWNER="$OWNER" REPO_NAME="$REPO_NAME" APP_TOKEN="$APP_TOKEN_SECRET" USER_TOKEN="$USER_TOKEN_SECRET"
```

## Help

Any advise for common problems or issues.

```
https://github.com/Quickbase-CS/deployqbforeact/issues
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
