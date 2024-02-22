import { Flex, Text } from "~/components";
import { IssueOpenedIcon } from '@primer/octicons-react';
import { Issue } from "~/api/fetchIssues";

type IssueCardProps = {
    className?: string;
    issue: Issue;
}

export default function IssueCard(props: IssueCardProps) {
    const { issue } = props;
    return (
        <Flex direction="column" gap="1" padding="1">
            <Flex align="start" gap="1">
                <IssueOpenedIcon className="rw-color-open" size={18} />
                <Flex direction="column" gap="1">
                    <Text size="2" weight="bold">
                        {issue.title}
                    </Text>
                    <Text size="1" weight="light" color="muted">
                        #{issue.number}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
}
