import { Flex, Card, Text } from "~/components";
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
        <Card>
            <Flex direction="column" gap="1">
                <Flex gap="1">
                    <IssueOpenedIcon className="rw-color-open" size={27} /><Text size="3" weight="bold">{issue.title}</Text>
                </Flex>
                <Text size="1" weight="light" color="muted">{issue.number}</Text>
            </Flex>
        </Card>
    );
}
