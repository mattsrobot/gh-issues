export const fetchIssuesQuery = `
query repository($owner: String!, $name: String!, $states: [IssueState!], $first: Int, $last: Int, $after: String, $before: String) {
    repository(owner: $owner, name: $name) {
        id
        openIssues: issues(states: OPEN) {
            totalCount
        }
        closedIssues: issues(states: CLOSED) {
            totalCount
        }
        issues(first: $first, last: $last, after: $after, before: $before, filterBy: { states: $states }, orderBy: { field: CREATED_AT, direction: DESC } ) {
            pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
            nodes {
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
                crossReferenced: timelineItems(first: 1, itemTypes: CROSS_REFERENCED_EVENT) {
                    filteredCount
                }
            }
        }
    }
}
`;

export type IssuesResponse = {
    repository?: Repository
}

export type Repository = {
    id: string
    openIssues: {
        totalCount: string;
    }
    closedIssues: {
        totalCount: string;
    }
    issues?: IssueConnection;
}

export type PageInfo = {
    startCursor?: string
    endCursor?: string
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export type IssueConnection = {
    nodes: [Issue]
    pageInfo: PageInfo
}

type IssueStateReason = "REOPENED" | "NOT_PLANNED" | "COMPLETED";

export type Issue = {
    id: string
    createdAt: string
    titleHTML: string
    number: number
    closed: boolean
    closedAt?: string
    stateReason?: IssueStateReason
    body?: string
    author: Actor
    labels: LabelConnection
    assignees: ActorConnection
    commentsCount: {
        totalCount: number
    }
    crossReferenced: {
        filteredCount: number
    }
}

export type LabelConnection = {
    totalCount: number
    nodes: [Label]
}

export type Label = {
    id: string
    name: string
    color: string
}

export type ActorConnection = {
    totalCount: number
    nodes: [Actor]
}

export type Actor = {
    login: string
    avatarUrl?: string
}
