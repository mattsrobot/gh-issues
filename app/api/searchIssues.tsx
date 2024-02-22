import { Repository, Issue } from "./fetchIssues";

export const searchIssues = `
query search($owner: String!, $name: String!, $searchQuery: String!) {
    repository(owner: $owner, name: $name) {
        id
        openIssues: issues(states: OPEN) {
            totalCount
        }
        closedIssues: issues(states: CLOSED) {
            totalCount
        }
    }
    search(first:15, type:ISSUE, query: $searchQuery) {
        issueCount
        nodes {
          __typename
           ... on Issue {
                id
                createdAt
                titleHTML
                body
                number
                closed
                closedAt
                stateReason
                author {
                    login
                }
                assignees(first: 5) {
                    totalCount
                    nodes {
                    login
                    avatarUrl(size: 20)
                    }
                }
                labels(first: 10) {
                    totalCount
                    nodes {
                    id
                    name
                    color
                    }
                }
                commentsCount: comments {
                    totalCount
                }
          }
        }
    }
}
`;

export type SearchResponse = {
    repository?: Repository
    search?: Search
}

export type Search = {
    issueCount: number
    nodes: [Issue]
}
