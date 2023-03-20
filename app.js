#!/usr/bin/env node

const helpers = require('./helpers/helper');
const stripBom = require('strip-bom');
const {
  generateAllAPICallPromises,
  addUpdateDbPage,
} = require('./helpers/helper');

const { XMLParser } = require('fast-xml-parser/src/fxp');
const parser = new XMLParser();
let arguments = process.argv;

console.log('Script started reading arguments', arguments);

const run = async () => {
  try {
    console.log('Script started');
    const GITHUB_TOKEN = arguments[2]?.split('=')[1];
    const OWNER = arguments[3]?.split('=')[1];
    const REPO_NAME = arguments[4]?.split('=')[1];
    const APP_TOKEN = arguments[5]?.split('=')[1];
    const USER_TOKEN = arguments[6]?.split('=')[1];
    const BRANCH = arguments[7]?.split('=')[1];
    let branchName = BRANCH;
    /* const commit_SHA = await helpers.getLatestCommitSHA(OWNER, REPO_NAME);
    console.log('commit_SHA', commit_SHA);
    const branchName = await helpers.getBranchFromLatestCommit(
      OWNER,
      REPO_NAME,
      commit_SHA
    );
    console.log('branchName', branchName); */
    const gitRepoObjForQbCLi = {
      owner: OWNER,
      repo: REPO_NAME,
      path: 'qbcli.json',
      ref: branchName || BRANCH || 'master',
    };

    if (APP_TOKEN === '' || USER_TOKEN === '') {
      console.error('Please provide the apptoken/usertoken to continued');
    }

    console.log('Script getFileContent started');

    const response = await helpers.getFileContent(gitRepoObjForQbCLi);

    console.log('Script getFileContent completed');

    let decoded = Buffer.from(response, 'base64').toString();

    const existingQbCliConfigs = JSON.parse(decoded);

    const gitRepoObjForDeployDirObj = {
      owner: OWNER,
      repo: REPO_NAME,
      path: existingQbCliConfigs.deployPath,
      ref: branchName || BRANCH || 'master',
    };

    let deploymentType = null;
    /* if (existingQbCliConfigs.isProd) {
      deploymentType = 'prod';
    } else if (existingQbCliConfigs.isDev) {
      deploymentType = 'dev';
    } else if (existingQbCliConfigs.isFeat) {
      deploymentType = 'feat';
    } */

    if (
      branchName.toLocaleLowerCase() === 'master' ||
      branchName.toLocaleLowerCase() === 'main'
    ) {
      deploymentType = 'prod';
    } else if (
      branchName.toLocaleLowerCase() === 'dev' ||
      branchName.toLocaleLowerCase() === 'development'
    ) {
      deploymentType = 'dev';
    } else {
      deploymentType = 'feat';
    }

    //get prefix for files
    const prefix = helpers.prefixGenerator(
      {
        customPrefix: existingQbCliConfigs.devPrefix,
        customPrefixProduction: existingQbCliConfigs.prodPrefix,
      },
      deploymentType,
      existingQbCliConfigs.repositoryId
    );

    //get file contents from the build
    try {
      //gets an array of file contents.  Each item in the array ahs filename, and filecontent, and conditionally a "isIndexFile" boolean.
      console.log('Script api getAllFileContents started');
      let arrayOfFileContents = await Promise.all(
        helpers.getAllFileContents(
          existingQbCliConfigs.filesConf,
          prefix,
          gitRepoObjForDeployDirObj,
          stripBom
        )
      );

      if (!arrayOfFileContents || arrayOfFileContents.length < 1) {
        console.error(
          'Please check your qbcli.json in the root of your project. Make sure you have mapped the correct path to all of the files you are trying to deploy.  Also check all filenames match what is in those directories - and that all files have content (this tool will not deploy blank files - add a comment in the file if you would like to deploy without code).'
        );
        return;
      }
      console.log('Script api getAllFileContents completed');

      //add the appopriate extension prefix to each file depending on whether it is dev/prod deployment.  IF an index file has been listed, set the indexFileName below.
      let indexFileName = null;
      arrayOfFileContents = arrayOfFileContents.map((item) => {
        const [fileName, fileContents, isIndexFile] = item;
        if (isIndexFile) {
          indexFileName = fileName;
        }
        return [`${prefix}${fileName}`, fileContents];
      });

      // create config for from qbcli file params.
      const configs = {
        dbid: existingQbCliConfigs.dbid,
        realm: existingQbCliConfigs.realm,
        apptoken: APP_TOKEN,
        usertoken: USER_TOKEN,
      };

      console.log('File deployment started');

      const result = await Promise.all(
        generateAllAPICallPromises(
          configs,
          arrayOfFileContents,
          addUpdateDbPage
        )
      );

      if (result.length > 0) {
        result.forEach((element) => {
          const responseObj = parser?.parse(element.data);
          const errorCode = responseObj?.qdbapi?.errcode;
          const pageName = responseObj?.qdbapi?.pagename;

          if (errorCode !== 0) {
            console.error(`Error Occurred for File: ${pageName}\n\n`);
            console.error(
              `API call failure - files weren\'t deployed successfully - see error details below. If you need to update your user/application token, you can run deployqb init again to reconfigure those values.\n\nQuick Base Response:`
            );
            console.log(responseObj);
            return;
          }
        });
      }
      console.log('Files deployed successfully!');
      process.exit(0);
    } catch (err) {
      console.error(
        `API call failure - files weren\'t deployed successfully - see error details below. If you need to update your user/application token, you can run deployqb init again to reconfigure those values.\n\nQuick Base Response:`
      );

      if (err?.response?.statusText) {
        console.error(err?.response?.statusText);
      }

      if (err?.response?.data) {
        console.error(err?.response?.data);
      }

      if (err?.response?.config?.data) {
        let errData = parser.parse(err?.response?.config?.data);
        let pageName = errData?.qdbapi?.pagename;
        console.error(`Error Occurred for File: ${pageName}\n\n`);
      }
      process.exit(1);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

run();
