/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/*.css"],
  serverModuleFormat: "cjs",
  appDirectory: "app",
  serverDependenciesToBundle: [
    "axios",
    "@octokit/app",
    "@octokit/auth-token",
    "@octokit/auth-unauthenticated",
    "@octokit/core",
    "@octokit/endpoint",
    "@octokit/graphql",
    "@octokit/plugin-paginate-graphql",
    "@octokit/plugin-paginate-rest",
    "@octokit/plugin-rest-endpoint-methods",
    "@octokit/plugin-retry",
    "@octokit/plugin-throttling",
    "@octokit/request",
    "@octokit/request-error",
    "@octokit/webhooks",
    "@octokit/webhooks-methods",
    "deprecation",
    "octokit",
    "universal-user-agent"
  ]
};
