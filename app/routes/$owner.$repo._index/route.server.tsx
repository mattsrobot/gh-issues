import { json, LoaderFunctionArgs } from "@remix-run/node";
import { RequestError, Octokit } from "octokit";
import logger from "~/components/logger";
import { createTokenAuth } from "@octokit/auth-token";
import { fetchIssuesQuery, IssuesResponse, Issue } from "~/api-gh/fetchIssues";
import { searchIssues, SearchResponse } from "~/api-gh/searchIssues";
import { internalApiRequest, InternalIssuesResponse, toGitHub } from "~/api-internal/fetchIssues";

export async function loader({ request, params }: LoaderFunctionArgs) {
    const repo = params.repo ?? "";
    const owner = params.owner ?? "";

    const wsUrl = process.env.WS_API_URL!
    const url = new URL(request.url);
    const state = url.searchParams.get("state") ?? "open";
    const query = url.searchParams.get("q") ?? "";

    let openCount: number | undefined,
        closedCount: number | undefined,
        startCursor: string | undefined,
        endCursor: string | undefined,
        error: string | undefined;

    let hasNextPage = false;
    let hasPreviousPage = false;

    let issues: Issue[] | undefined

    const logRequest = logger.child({ repo, owner, });
    logRequest.info('🏃 starting fetching issues');

    try {
        if (repo == "gh-issues" && owner == "mattsrobot") {
            // Call our internal REST API for sync'd GitHub Repos

            let url = `${process.env.PRIVATE_API_URL!}/internal/repo/${owner}/${repo}/issues?state=${state}`;

            if (query && query.length > 0) {
                url += `&q=${query}`;
            }

            const response = await internalApiRequest<InternalIssuesResponse>({
                url: url,
            });

            openCount = response.data?.open_count ?? 0;
            closedCount = response.data?.closed_count ?? 0;

            logRequest.info(response.data?.issues);

            issues = (response.data?.issues ?? []).map((e) => toGitHub(e));
        } else {
            // Call the GitHub GraphQL API for repos not sync'd

            const auth = createTokenAuth(process.env.GITHUB_AUTH_TOKEN!);

            const { token } = await auth();

            const octokit = new Octokit({
                auth: token,
            });

            const cursor = url.searchParams.get("cursor") ?? undefined;
            const direction = url.searchParams.get("direction") ?? "forward";

            let first: number | undefined
            let last: number | undefined
            let before: string | undefined
            let after: string | undefined

            if (direction == "forward") {
                first = 25;
                after = cursor;
            } else {
                last = 25;
                before = cursor;
            }

            if (query.length > 0) {

                const template = `repo:${owner}/${repo} type:issue in:title sort:createdAt-desc`;
                const searchQuery = `${template} state:${state} ${query}`;
                const alternativeSearchQuery = `${template} state:${state == "open" ? "closed" : "open"} ${query}`;

                logRequest.info(`🏃 searching`);

                const params = {
                    searchQuery,
                    alternativeSearchQuery,
                    first,
                    last,
                    before,
                    after,
                }

                let searchData: SearchResponse = await octokit.graphql(searchIssues, params);

                endCursor = searchData?.search?.pageInfo?.endCursor;
                startCursor = searchData?.search?.pageInfo?.startCursor;
                hasNextPage = searchData?.search?.pageInfo?.hasNextPage ?? false;
                hasPreviousPage = searchData?.search?.pageInfo?.hasPreviousPage ?? false;;

                if (searchQuery.includes("state:open")) {
                    openCount = searchData?.search?.issueCount ?? 0;
                    closedCount = searchData?.alternativeCount?.issueCount ?? 0;
                } else {
                    openCount = searchData?.alternativeCount?.issueCount ?? 0;
                    closedCount = searchData?.search?.issueCount ?? 0;
                }

                issues = searchData?.search?.nodes ?? [];

                logRequest.info('✅ completed searching issues');
            } else {

                const params = {
                    owner,
                    name: repo,
                    states: [state.toUpperCase()],
                    first,
                    last,
                    before,
                    after,
                }

                const response: IssuesResponse = await octokit.graphql(fetchIssuesQuery, params);

                openCount = response.repository?.openIssues?.totalCount ?? 0;
                closedCount = response.repository?.closedIssues?.totalCount ?? 0;

                endCursor = response.repository?.issues?.pageInfo?.endCursor;
                startCursor = response.repository?.issues?.pageInfo?.startCursor;
                hasNextPage = response.repository?.issues?.pageInfo?.hasNextPage ?? false;
                hasPreviousPage = response.repository?.issues?.pageInfo?.hasPreviousPage ?? false;

                issues = response.repository?.issues?.nodes ?? [];

                logRequest.info('✅ completed fetching issues');
            }
        }
    } catch (err) {
        let status, message;

        if (err instanceof RequestError) {
            status = err.status;
            message = err.message;
        } else {
            status = 500;
            message = "Unhandled error";
        }

        const logError = logger.child({
            repo,
            owner,
            message,
            status,
            error
        });

        error = message

        logError.error('🔥 had an error fetching issues');
    } finally {
        return json({
            wsUrl,
            owner,
            repo,
            openCount,
            closedCount,
            issues,
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage,
            error
        });
    }
}
