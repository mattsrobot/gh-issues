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
        issues(first: 50, filterBy: { states: $states }, orderBy: { field: CREATED_AT, direction: DESC } ) {
            totalCount
            nodes {
                id
                createdAt
                titleHTML
                body
                number
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
    repository?: Repository;
}

export type Repository = {
    id: string;
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

export type Issue = {
    id: string
    createdAt: string;
    titleHTML: string
    number: number
    body?: string
    author: Actor
    commentsCount: {
        totalCount: number;
    }
}

export type Actor = {
    login: string
    avatarUrl?: string
}
