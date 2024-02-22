export const fetchIssuesQuery = `
query repository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
        id
        openIssues: issues(states: OPEN) {
            totalCount
        }
        closedIssues: issues(states: CLOSED) {
            totalCount
        }
        issues(last: 50, filterBy: { states: [OPEN] } ) {
            totalCount
            nodes {
                id
                createdAt
                titleHTML
                body
                number
                author {
                    login
                    avatarUrl(size: 30)
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
    author: Author
    commentsCount: {
        totalCount: number;
    }
}

export type Author = {
    login: string
    avatarUrl: string
}
