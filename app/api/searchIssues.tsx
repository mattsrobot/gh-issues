import { Issue } from "./fetchIssues";

export const searchIssues = `
query search($searchQuery: String!, $alternativeSearchQuery: String!) {
    alternativeCount: search(type:ISSUE, query: $alternativeSearchQuery) {
        issueCount
    }
    search(first:15, type:ISSUE, query: $searchQuery) {
        issueCount
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
        issueCount: number
        nodes: [Issue]
    }
    alternativeCount?: {
        issueCount: number
    }
}
