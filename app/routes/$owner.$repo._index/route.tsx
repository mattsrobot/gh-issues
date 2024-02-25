import type { MetaFunction } from "@remix-run/node";
import { List, ListHeader, Button, Flex, Text } from "~/components";
import { useLoaderData, useSearchParams, useNavigation, NavLink } from "@remix-run/react";
import { IssueOpenedIcon, HubotIcon, LogoGithubIcon, TelescopeIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@primer/octicons-react';
import IssueCard from "./issue-card";
import { CenteredContent } from "~/layouts";
import { useCallback, useEffect, useState } from "react";
import { TopNavigation, SearchTextField } from "~/navigation";
import { useDebounceCallback } from "~/helpers/use-debounce";
import { randomPhrase } from "~/helpers/funny-phrases";
import type { loader } from "./route.server";
export { loader } from "./route.server";
import useWebSocket from 'react-use-websocket';

type IssueState = "open" | "closed";

export const meta: MetaFunction = ({ params }) => {
    const repo = params.repo ?? "";
    const owner = params.owner ?? "";

    return [
        { title: `Issues - ${owner}/${repo}` },
        { name: "description", content: "Welcome!" },
    ];
};

export default function Index() {

    const {
        wsUrl,
        issues: data,
        error,
        repo,
        owner,
        openCount,
        closedCount,
        startCursor,
        endCursor,
        hasNextPage,
        hasPreviousPage
    } = useLoaderData<typeof loader>();

    const { lastJsonMessage, sendJsonMessage } = useWebSocket(wsUrl, {
        heartbeat: true,
        onOpen: () => {
            console.log("You are connected 🚇");
        },
        onError: () => {
            console.log("Errors did happen :(");
        },
        onClose: () => {
            console.log("Where did you go :(");
        },
    }, true);

    const [issues, setIssues] = useState(data ?? []);

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
        setIssues(data ?? []);
    }, [data]);

    useEffect(() => {
        sendJsonMessage({ "type": "subscribe", "topic": `repo-${owner}-${repo}` });
    }, [repo, owner]);

    useEffect(() => {
        const msg: any = lastJsonMessage;
        if (msg?.topic == `repo-${owner}-${repo}`) {
            searchParams.set("u", msg?.message);
            setSearchParams(searchParams, {
                preventScrollReset: true,
            });

        }
    }, [lastJsonMessage, repo, owner, searchParams]);

    const blur = navigation.state == "loading";

    const localizedOpenCount = (openCount ?? "0").toLocaleString();
    const localizedClosedCount = (closedCount ?? "0").toLocaleString();

    return (
        <>
            <TopNavigation>
                <CenteredContent>
                    <Flex direction="row" gap="3" align="center" padding="3">
                        <NavLink className="rw-reset rw-github-logo" to={`/${owner}/${repo}`} aria-label="GitHub">
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
                                        <Button disabled={blur || !hasPreviousPage} onClick={goPrevious}><ChevronLeftIcon />Previous</Button>
                                        <Button disabled={blur || !hasNextPage} onClick={goNext}>Next <ChevronRightIcon /></Button>
                                    </Flex>
                                </Flex>
                            </footer>}
                        </>}
                </List>
            </CenteredContent>
        </>
    );
}
