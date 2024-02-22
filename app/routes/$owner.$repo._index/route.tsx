import type { MetaFunction } from "@remix-run/node";
import { Card, List, ListHeader, Button, Flex, Text } from "~/components";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { RequestError, Octokit } from "octokit";
import { IssueOpenedIcon } from '@primer/octicons-react';
import IssueCard from "./issue-card";
import logger from "~/components/logger";
import { createTokenAuth } from "@octokit/auth-token";
import { CenteredContent } from "~/layouts";
import { fetchIssuesQuery, IssuesResponse } from "~/api/fetchIssues";
import { useCallback } from "react";
import { TopNavigation, SearchTextField } from "~/navigation";

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

        const logRequest = logger.child({ repo, owner, });
        logRequest.info('🏃 starting fetching issues');

        const response: IssuesResponse = await octokit.graphql(fetchIssuesQuery, {
            owner: owner,
            name: repo,
            states: [state.toUpperCase()]
        });

        const data = response.repository

        logRequest.info('✅ completed fetching issues');

        return json({
            owner,
            repo,
            data,
            error: null
        });

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
            error: message
        });
    }
}

export default function Index() {
    const { data, error, repo, owner } = useLoaderData<typeof loader>();

    const openCount = data?.openIssues?.totalCount ?? "";
    const closedCount = data?.closedIssues?.totalCount ?? "";

    const [searchParams, setSearchParams] = useSearchParams();

    const state = searchParams.get("state") ?? "open";

    const updateState = useCallback((s: IssueState) => {
        searchParams.set("state", s);
        setSearchParams(searchParams, {
            preventScrollReset: true,
        });
    }, [setSearchParams, searchParams]);

    return (
        <>
            <TopNavigation>
                <CenteredContent>
                    <Flex direction="row" gap="3" align="center" padding="3">
                        <Flex direction="row" align="center">
                            <Button>{owner}</Button>
                            <Text color="muted">/</Text>
                            <Button>{owner}</Button>
                        </Flex>
                        <SearchTextField placeholder="Search" />
                    </Flex>
                </CenteredContent>
            </TopNavigation>
            <CenteredContent>
                <List>
                    <ListHeader>
                        <Button variant="ghost" muted={state == "closed"} onClick={() => updateState("open")}>
                            <Flex direction="row" align="center" gap="2">
                                <IssueOpenedIcon size={15} /> Open {openCount}
                            </Flex>
                        </Button>
                        <Button variant="ghost" muted={state == "open"} onClick={() => updateState("closed")}>
                            Closed {closedCount}
                        </Button>
                    </ListHeader>
                    {!!error && <Card>
                        {`Got an error - ${error}`}
                    </Card>}
                    {data?.issues?.nodes?.map((e) => <IssueCard key={`issue-${e.id}`} issue={e} />)}
                </List>
            </CenteredContent>
        </>
    );
}
