import { Issue } from "./fetchIssues";

export const searchIssues = `
query search($openSearchQuery: String!, $closedSearchQuery: String!, $searchQuery: String!) {
    openIssues: search(first:15, type:ISSUE, query: $openSearchQuery) {
        issueCount
    }
    closedIssues: search(first:15, type:ISSUE, query: $closedSearchQuery) {
        issueCount
    }
    search(first:15, type:ISSUE, query: $searchQuery) {
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
    openIssues?: {
        issueCount: number
    }
    closedIssues?: {
        issueCount: number
    }
    search?: {
        nodes: [Issue]
    }
}
