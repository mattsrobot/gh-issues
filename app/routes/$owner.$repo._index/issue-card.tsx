import { Flex, Text } from "~/components";
import { IssueOpenedIcon, IssueClosedIcon, CircleSlashIcon } from '@primer/octicons-react';
import { Issue } from "~/api/fetchIssues";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CommentIcon } from '@primer/octicons-react';

dayjs.extend(relativeTime);

type IssueCardProps = {
    className?: string;
    issue: Issue;
}

export default function IssueCard(props: IssueCardProps) {
    const { issue } = props;
    return (
        <Flex direction="row" gap="4" padding="1" align="start">
            <Flex align="start" gap="2" auto>
                {issue.closed ?
                    issue.stateReason == "NOT_PLANNED" ? <CircleSlashIcon className="rw-color-muted" size={15} /> : <IssueClosedIcon className="rw-color-done" size={15} /> :
                    <IssueOpenedIcon className="rw-color-open" size={15} />}
                <Flex direction="column" gap="1">
                    <Text size="2" weight="bold">
                        <span dangerouslySetInnerHTML={{ __html: issue.titleHTML }} />
                    </Text>
                    {issue.closed ?
                        <Text size="1" weight="regular" color="muted">
                            #{issue.number} by <span className="rw-accent-hover">{issue.author?.login}</span> was closed {dayjs(issue.closedAt).fromNow()}
                        </Text> :
                        <Text size="1" weight="regular" color="muted">
                            #{issue.number} opened {dayjs(issue.createdAt).fromNow()} by <span className="rw-accent-hover">{issue.author?.login}</span>
                        </Text>}
                </Flex>
            </Flex>
            <Flex direction="row" align="center" gap="4">
                {issue.assignees.totalCount > 0 && <Flex className="rw-accent-hover" direction="row" align="center" gap="1" shrink>
                    {issue.assignees.nodes.map((e) => <img className="rw-smol-avatar" key={`${issue.id}-${e.login}`} src={e.avatarUrl} />)}
                </Flex>}
                {issue.commentsCount.totalCount > 0 && <Flex className="rw-accent-hover" direction="row" align="end" gap="1" shrink>
                    <CommentIcon className="rw-color-muted" size={15} />
                    <Text size="1" color="muted">{issue.commentsCount.totalCount}</Text>
                </Flex>}
            </Flex>
        </Flex>
    );
}
