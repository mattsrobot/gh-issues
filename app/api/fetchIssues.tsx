export const fetchIssuesQuery = `
query repository($owner: String!, $name: String!, $states: [IssueState!]) {
    repository(owner: $owner, name: $name) {
        id
        openIssues: issues(states: OPEN) {
            totalCount
        }
        closedIssues: issues(states: CLOSED) {
            totalCount
        }
        issues(first: 15, filterBy: { states: $states }, orderBy: { field: CREATED_AT, direction: DESC } ) {
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
                commentsCount: comments {
                    totalCount
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
        totalCount: number;
    }
    closedIssues: {
        totalCount: number;
    }
    issues: IssueConnection;
}

export type IssueConnection = {
    nodes: [Issue]
}

export type ActorConnection = {
    totalCount: number
    nodes: [Actor]
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
    assignees: ActorConnection
    commentsCount: {
        totalCount: number
    }
}

export type Actor = {
    login: string
    avatarUrl?: string
}
