import type { MetaFunction } from "@remix-run/node";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { List, ListHeader, Button, Flex, Text } from "~/components";
import { useLoaderData, useSearchParams, useNavigation, NavLink } from "@remix-run/react";
import { RequestError, Octokit } from "octokit";
import { IssueOpenedIcon, HubotIcon, LogoGithubIcon, TelescopeIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@primer/octicons-react';
import IssueCard from "./issue-card";
import logger from "~/components/logger";
import { createTokenAuth } from "@octokit/auth-token";
import { CenteredContent } from "~/layouts";
import { fetchIssuesQuery, IssuesResponse, Repository } from "~/api/fetchIssues";
import { searchIssues, SearchResponse } from "~/api/searchIssues";
import { useCallback, useEffect, useState } from "react";
import { TopNavigation, SearchTextField } from "~/navigation";
import { useDebounceCallback } from "~/helpers/use-debounce";
import { randomPhrase } from "~/helpers/funny-phrases";

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

    let openCount: string | undefined,
        closedCount: string | undefined,
        startCursor: string | undefined,
        endCursor: string | undefined,
        error: string | undefined;

    let hasNextPage = false;
    let hasPreviousPage = false;

    let data: Repository | undefined
    let searchData: SearchResponse | undefined

    try {
        const auth = createTokenAuth(process.env.GITHUB_AUTH_TOKEN!);

        const { token } = await auth();

        const octokit = new Octokit({
            auth: token,
        });

        const url = new URL(request.url);
        const state = url.searchParams.get("state") ?? "open";
        const query = url.searchParams.get("q") ?? "";

        const cursor = url.searchParams.get("cursor") ?? undefined;
        const direction = url.searchParams.get("direction") ?? "forward";

        const logRequest = logger.child({ repo, owner, });
        logRequest.info('🏃 starting fetching issues');

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

            searchData = await octokit.graphql(searchIssues, params);

            endCursor = searchData?.search?.pageInfo?.endCursor;
            startCursor = searchData?.search?.pageInfo?.startCursor;
            hasNextPage = searchData?.search?.pageInfo?.hasNextPage ?? false;
            hasPreviousPage = searchData?.search?.pageInfo?.hasPreviousPage ?? false;;

            if (searchQuery.includes("state:open")) {
                openCount = searchData?.search?.issueCount ?? "";
                closedCount = searchData?.alternativeCount?.issueCount ?? "";
            } else {
                openCount = searchData?.alternativeCount?.issueCount ?? "";
                closedCount = searchData?.search?.issueCount ?? "";
            }

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

            data = response.repository;

            openCount = data?.openIssues?.totalCount ?? "";
            closedCount = data?.closedIssues?.totalCount ?? "";

            endCursor = data?.issues?.pageInfo?.endCursor;
            startCursor = data?.issues?.pageInfo?.startCursor;
            hasNextPage = data?.issues?.pageInfo?.hasNextPage ?? false;
            hasPreviousPage = data?.issues?.pageInfo?.hasPreviousPage ?? false;;

            logRequest.info('✅ completed fetching issues');
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
            owner,
            repo,
            openCount,
            closedCount,
            data,
            searchData,
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage,
            error
        });
    }
}

export default function Index() {

    const { data, searchData, error, repo, owner, openCount, closedCount, startCursor, endCursor, hasNextPage, hasPreviousPage } = useLoaderData<typeof loader>();

    const [issues, setIssues] = useState(data?.issues?.nodes ?? []);

    const [searchParams, setSearchParams] = useSearchParams();

    const navigation = useNavigation();

    const state = searchParams.get("state") ?? "open";

    const [funnyPhrase, setFunnyPhrase] = useState(randomPhrase());
    const debouncedFunnyPhrase = useDebounceCallback(setFunnyPhrase, 1000);

    const q = searchParams.get("q") ?? "";

    const [searchInput, setSearchInput] = useState(q ?? "");
    const debouncedSearchInput = useDebounceCallback(setSearchInput, 80);

    const updateCursor = useCallback((cursor: string | undefined, direction: string | undefined) => {

        if (direction) {
            searchParams.set("direction", direction);
        } else {
            searchParams.delete("direction");
        }

        if (cursor) {
            searchParams.set("cursor", cursor);
        } else {
            searchParams.delete("cursor");
        }

        setSearchParams(searchParams, {
            preventScrollReset: false,
        });
    }, [searchParams]);

    const goPrevious = useCallback(() =>
        updateCursor(startCursor, "prev"),
        [updateCursor, startCursor]);

    const goNext = useCallback(() =>
        updateCursor(endCursor, "forward"),
        [updateCursor, endCursor]);

    const updateIssueState = useCallback((s: IssueState) => {
        searchParams.delete("cursor");
        searchParams.delete("direction");
        searchParams.set("state", s);

        setSearchParams(searchParams, {
            preventScrollReset: false,
        });
    }, [searchParams]);

    useEffect(() => {
        if (q == searchInput) {
            return;
        }

        console.log("search input changed");

        if (searchInput.length > 0) {
            searchParams.set("q", searchInput);
        } else {
            searchParams.delete("q");
        }

        debouncedFunnyPhrase(randomPhrase());

        setSearchParams(searchParams, {
            preventScrollReset: true,
        });

    }, [searchInput, q]);

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

    const blur = navigation.state == "loading";

    const localizedOpenCount = (openCount ?? "0").toLocaleString();
    const localizedClosedCount = (closedCount ?? "0").toLocaleString();

    return (
        <>
            <TopNavigation>
                <CenteredContent>
                    <Flex direction="row" gap="3" align="center" padding="3">
                        <NavLink className="rw-reset rw-github-logo" to={`/${owner}/${repo}`}>
                            <LogoGithubIcon size={25} />
                        </NavLink>
                        <Flex direction="row" align="center">
                            <Button>{owner}</Button>
                            <Text color="muted">/</Text>
                            <Button>{repo}</Button>
                        </Flex>
                        <div style={{ flexGrow: 1 }} />
                        <SearchTextField placeholder="Search" defaultValue={searchInput} onChange={debouncedSearchInput} />
                    </Flex>
                </CenteredContent>
            </TopNavigation>
            <CenteredContent>
                <List blur={blur}>
                    <ListHeader>
                        <Button variant="ghost" muted={state == "closed"} onClick={() => updateIssueState("open")}>
                            <Flex direction="row" align="center" gap="2">
                                <IssueOpenedIcon size={15} /> Open {localizedOpenCount}
                            </Flex>
                        </Button>
                        <Button variant="ghost" muted={state == "open"} onClick={() => updateIssueState("closed")}>
                            <CheckIcon /> Closed {localizedClosedCount}
                        </Button>
                    </ListHeader>
                    {issues.length == 0 ?
                        <Flex className="rw-no-results" padding="5" direction="column" align="center" gap="4">
                            {blur ?
                                <>
                                    <TelescopeIcon size={50} />
                                    <Text size="4" weight="extra-bold">Searching...</Text>
                                    <Text size="1" color="muted">{funnyPhrase}</Text>
                                </>
                                :
                                !!error ?
                                    <>
                                        <img src="/thundering-unicorn.webp" width={150} alt="thundering unicorns" />
                                        <Text size="4" weight="extra-bold">Oops...</Text>
                                        <Text size="1" color="muted">{error}</Text>
                                    </>
                                    :
                                    <>
                                        <HubotIcon size={50} />
                                        <Text size="4" weight="extra-bold">No results :(</Text>
                                        <Text size="1" color="muted" >Try searching for something else</Text>
                                    </>
                            }
                        </Flex> :
                        <>
                            {issues.map((e) => <IssueCard key={`issue-${e.id}`} issue={e} blur={blur} />)}
                            {<footer className="rw-list-footer">
                                <Flex padding="2" direction="column" align="center">
                                    <Flex direction="row" gap="2">
                                        <Button disabled={!hasPreviousPage} onClick={goPrevious}><ChevronLeftIcon />Previous</Button>
                                        <Button disabled={!hasNextPage} onClick={goNext}>Next <ChevronRightIcon /></Button>
                                    </Flex>
                                </Flex>
                            </footer>}
                        </>}
                </List>
            </CenteredContent>
        </>
    );
}
