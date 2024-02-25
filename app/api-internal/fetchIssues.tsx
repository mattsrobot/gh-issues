import axios from 'axios';
import { Issue, Label } from '~/api-gh/fetchIssues';

export type InternalIssuesResponse = {
    open_count: number
    closed_count: number
    issues: [InternalIssue]
}

export type InternalActor = {
    login: string
    avatar_url: string
}

export type InternalIssue = {
    id: string
    created_at: string
    title: string
    issue_number: number
    comments_count: number
    closed: boolean
    labels: Label[],
    assignees: InternalActor[],
    author: {
        login: string
        avatar_url: string
    }
}

export function toGitHub(e: InternalIssue): Issue {
    return {
        id: e.id,
        titleHTML: e.title,
        createdAt: e.created_at,
        number: e.issue_number,
        closed: e.closed,
        commentsCount: {
            totalCount: e.comments_count,
        },
        author: {
            login: e.author.login,
            avatarUrl: e.author.avatar_url,
        },
        labels: {
            totalCount: e.labels.length,
            nodes: e.labels,
        },
        crossReferenced: {
            filteredCount: 0,
        },
        assignees: {
            totalCount: e.assignees.length,
            nodes: e.assignees.map((a) => {
                return {
                    login: a.login,
                    avatarUrl: a.avatar_url,
                }
            }),
        }
    }
}

type APIRequest = {
    url: string
}

type APIResponse<T> = {
    data?: T
    errors?: { message: string }[]
    status: number
}

export async function internalApiRequest<T>({ url }: APIRequest): Promise<APIResponse<T>> {
    let errors: { message: string }[] = [];
    let data: T | undefined = undefined;
    let status = 200;

    const headers = {
        'Content-Type': 'application/json',
    }

    try {
        const { data: d, status: s } = await axios({
            method: "GET",
            url: url,
            headers: headers,
            timeout: 15_000,
        });

        data = d;
        status = s;
        errors = d?.errors;
    } catch (error) {
        errors = [{ message: "Unexpected error" }];

        console.error(errors)
    }

    return {
        data,
        errors,
        status,
    };
}
