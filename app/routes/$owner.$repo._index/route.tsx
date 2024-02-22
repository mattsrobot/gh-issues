import type { MetaFunction } from "@remix-run/node";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { List, ListHeader, Button, Flex, Text } from "~/components";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { RequestError, Octokit } from "octokit";
import { IssueOpenedIcon } from '@primer/octicons-react';
import IssueCard from "./issue-card";
import logger from "~/components/logger";
import { createTokenAuth } from "@octokit/auth-token";
import { CenteredContent } from "~/layouts";
import { fetchIssuesQuery, IssuesResponse } from "~/api/fetchIssues";
import { searchIssues, SearchResponse } from "~/api/searchIssues";
import { useCallback, useEffect, useState } from "react";
import { TopNavigation, SearchTextField } from "~/navigation";
import { useDebounceCallback } from "~/helpers/use-debounce";

type IssueState = "open" | "closed";

export const meta: MetaFunction = ({ params }) => {
    const repo = params.repo ?? "";
    const owner = params.owner ?? "";

    return [
        { title: `Issues - ${owner}/${repo}` },
        { name: "description", content: "Welcome!" },
    ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
    const repo = params.repo ?? "";
    const owner = params.owner ?? "";

    try {
        const auth = createTokenAuth(process.env.GITHUB_AUTH_TOKEN!);

        const { token } = await auth();

        const octokit = new Octokit({
            auth: token,
        });

        const url = new URL(request.url);
        const state = url.searchParams.get("state") ?? "open";
        const query = url.searchParams.get("q") ?? "";

        const logRequest = logger.child({ repo, owner, });
        logRequest.info('🏃 starting fetching issues');


        if (query.length > 0) {

            const searchQuery = `repo:${owner}/${repo} type:issue state:${state} in:title sort:createdAt-desc ${query}`;

            logRequest.info(`🏃 searching ${searchQuery}`);

            const searchData: SearchResponse = await octokit.graphql(searchIssues, {
                owner,
                name: repo,
                searchQuery,
            });

            logRequest.info('✅ completed searching issues');

            return json({
                owner,
                repo,
                data: null,
                searchData,
                error: null
            });

        } else {
            const response: IssuesResponse = await octokit.graphql(fetchIssuesQuery, {
                owner,
                name: repo,
                states: [state.toUpperCase()]
            });

            const data = response.repository

            logRequest.info('✅ completed fetching issues');

            return json({
                owner,
                repo,
                data,
                searchData: null,
                error: null
            });
        }

    } catch (error) {
        let status, message;

        if (error instanceof RequestError) {
            status = error.status;
            message = error.message;
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

        logError.error('🔥 had an error fetching issues');

        return json({
            owner,
            repo,
            data: null,
            searchData: null,
            error: message
        });
    }
}

export default function Index() {

    const { data, searchData, error, repo, owner } = useLoaderData<typeof loader>();

    const [issues, setIssues] = useState(data?.issues?.nodes ?? []);

    const openCount = "";
    const closedCount = "";

    const [searchParams, setSearchParams] = useSearchParams();

    const state = searchParams.get("state") ?? "open";

    const updateIssueState = useCallback((s: IssueState) => {
        searchParams.set("state", s);
        setSearchParams(searchParams, {
            preventScrollReset: true,
        });
    }, [searchParams]);

    const [searchInput, setSearchInput] = useState('')

    const debouncedSearchInput = useDebounceCallback(setSearchInput, 200);

    useEffect(() => {
        searchParams.set("q", searchInput);

        setSearchParams(searchParams, {
            preventScrollReset: true,
        });

    }, [searchInput]);

    useEffect(() => {
        if (!!data) {
            setIssues(data.issues?.nodes ?? []);
        }
    }, [data]);

    useEffect(() => {
        if (!!searchData) {
            setIssues(searchData.search?.nodes ?? []);
        }
    }, [searchData]);

    return (
        <>
            <TopNavigation>
                <CenteredContent>
                    <Flex direction="row" gap="3" align="center" padding="3">
                        <Flex direction="row" align="center">
                            <Button>{owner}</Button>
                            <Text color="muted">/</Text>
                            <Button>{repo}</Button>
                        </Flex>
                        <SearchTextField placeholder="Search" onChange={debouncedSearchInput} />
                    </Flex>
                </CenteredContent>
            </TopNavigation>
            <CenteredContent>
                <List>
                    <ListHeader>
                        <Button variant="ghost" muted={state == "closed"} onClick={() => updateIssueState("open")}>
                            <Flex direction="row" align="center" gap="2">
                                <IssueOpenedIcon size={15} /> Open {openCount}
                            </Flex>
                        </Button>
                        <Button variant="ghost" muted={state == "open"} onClick={() => updateIssueState("closed")}>
                            Closed {closedCount}
                        </Button>
                    </ListHeader>
                    {issues.length == 0 ?
                        <Flex className="rw-no-results" padding="5" direction="column" align="center">
                            {!!error ?
                                <Text color="danger">{error}</Text> :
                                <Text color="muted" weight="bold">No results</Text>}
                        </Flex> :
                        issues.map((e) => <IssueCard key={`issue-${e.id}`} issue={e} />)}
                </List>
            </CenteredContent>
        </>
    );
}
