import type { MetaFunction } from "@remix-run/node";
import { Card, List, ListHeader, Button, Flex } from "~/components";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, } from "@remix-run/react";
import { RequestError, Octokit } from "octokit";
import { IssueOpenedIcon } from '@primer/octicons-react';
import IssueCard from "./issue-card";
import logger from "~/components/logger";
import { createTokenAuth } from "@octokit/auth-token";
import { CenteredContent } from "~/layouts";
import { fetchIssuesQuery, IssuesResponse } from "~/api/fetchIssues";

export const meta: MetaFunction = () => {
    return [
        { title: "Org Repo" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export async function loader({ params }: LoaderFunctionArgs) {

    const auth = createTokenAuth(process.env.GITHUB_AUTH_TOKEN!);
    const { token } = await auth();
    const octokit = new Octokit({
        auth: token,
    });

    const repo = params.repo ?? "";
    const owner = params.owner ?? "";

    const logRequest = logger.child({ repo, owner, });
    logRequest.info('🏃 starting fetching issues');

    try {

        const response: IssuesResponse = await octokit.graphql(fetchIssuesQuery, {
            owner: "rails",
            name: "rails"
        });

        const repository = response.repository

        logRequest.info('✅ completed fetching issues');

        return json({
            repository,
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
        });

        logError.error('🔥 had an error fetching issues');

        return json({
            repository: null,
            error: message
        });
    }
}

export default function Index() {
    const { repository, error } = useLoaderData<typeof loader>();

    const openCount = repository?.openIssues?.totalCount ?? "";
    const closedCount = repository?.closedIssues?.totalCount ?? "";

    return (
        <CenteredContent>
            <List>
                <ListHeader>
                    <Button variant="ghost">
                        <Flex direction="row" align="center" gap="2">
                            <IssueOpenedIcon size={18} /> Open {openCount}
                        </Flex>
                    </Button>
                    <Button variant="ghost" muted>
                        Closed {closedCount}
                    </Button>
                </ListHeader>
                {!!error && <Card>
                    {`Got an error - ${error}`}
                </Card>}
                {repository?.issues?.nodes?.map((e) => <IssueCard key={e.id} issue={e} />)}
            </List>
        </CenteredContent>
    );
}
