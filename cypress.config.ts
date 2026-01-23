import path from "path";
import _ from "lodash";
import axios from "axios";
import dotenv from "dotenv";
import Promise from "bluebird";
import codeCoverageTask from "@cypress/code-coverage/task";
import { defineConfig } from "cypress";
import viteConfig from "./vite.cypress.config.ts";

dotenv.config({ path: ".env.local" });
dotenv.config();

let awsConfig = {
  default: undefined,
};

try {
  awsConfig = require(path.join(__dirname, "./aws-exports-es5.js"));
} catch (e) {}

export default defineConfig({
  projectId: "7s5okt",

  retries: {
    runMode: 2,
  },

  env: {
    apiUrl: "http://localhost:3003",
    defaultPassword: "s3cret",
    coverage: false,
    codeCoverage: {
      url: "http://localhost:3002/__coverage__",
      exclude: "cypress/**/*.*",
    },
    cognito_domain: process.env.AWS_COGNITO_DOMAIN,
    cognito_programmatic_login: false,
    awsConfig: awsConfig.default,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig,
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
  },

  e2e: {
    baseUrl: "http://localhost:3000",
    pageLoadTimeout: 60000,
    
    specPattern: "cypress/tests/**/*.spec.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",

    setupNodeEvents(on, config) {
      const testDataApiEndpoint = `${config.env.apiUrl}/testData`;

      on("task", {
        async "db:seed"() {
          const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
          return data;
        },
        async "filter:database"({ entity, query }) {
          try {
            const { data } = await axios.post(`${testDataApiEndpoint}/filter`, {
              entity,
              query,
            });
            return data;
          } catch (err: any) {
            console.error("filter:database failed:", err.message);
            return [];
          }
        },
      });

      codeCoverageTask(on, config);

      return config;
    },
  } 
});