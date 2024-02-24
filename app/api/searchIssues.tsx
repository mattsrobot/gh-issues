import { Issue, PageInfo } from "./fetchIssues";

export const searchIssues = `
query search($searchQuery: String!, $alternativeSearchQuery: String!, $first: Int, $last: Int, $after: String, $before: String) {
    alternativeCount: search(type:ISSUE, query: $alternativeSearchQuery) {
        issueCount
    }
    search(first: $first, last: $last, after: $after, before: $before, type:ISSUE, query: $searchQuery) {
        issueCount
        pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
        }
        nodes {
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
    search?: {
        issueCount: string
        nodes: [Issue]
        pageInfo: PageInfo
    }
    alternativeCount?: {
        issueCount: string
    }
}
