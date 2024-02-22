import { Flex, Text } from "~/components";
import { IssueOpenedIcon } from '@primer/octicons-react';

type Issue = {
    id: number;
    number: number;
    state: string;
    title: string;
    body?: string | null;
    user?: {
        id: number;
        login: string;
        avatar_url: string;
    } | null
}

type IssueCardProps = {
    className?: string;
    issue: Issue;
}

export default function IssueCard(props: IssueCardProps) {
    const { issue } = props;
    return (
        <Flex direction="column" gap="1" padding="1">
            <Flex align="center" gap="1">
                <IssueOpenedIcon className="rw-color-open" size={18} />
                <Text size="2" weight="bold">
                    {issue.title}
                </Text>
            </Flex>
            <Text size="1" weight="light" color="muted">
                #{issue.number}
            </Text>
        </Flex>
    );
}
