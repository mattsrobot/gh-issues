import './styles.issue-card.css';

import { Flex, Text, Label } from "~/components";
import { IssueOpenedIcon, IssueClosedIcon, CircleSlashIcon, GitPullRequestIcon } from '@primer/octicons-react';
import { Issue } from "~/api-gh/fetchIssues";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CommentIcon } from '@primer/octicons-react';
import hexToRGB from "~/helpers/hex-to-rgba";
import pSBC from "~/helpers/psbc";

dayjs.extend(relativeTime);

type IssueCardProps = {
    blur?: boolean;
    issue: Issue;
} & typeof defaultProps;

const defaultProps = {
    blur: false,
};

export default function IssueCard({ issue, blur }: IssueCardProps) {
    return (
        <Flex direction="row" gap="4" padding="1" align="start">
            <Flex align="start" gap="2" auto>
                {issue.closed ?
                    issue.stateReason == "NOT_PLANNED" ? <CircleSlashIcon className="rw-color-muted" size={15} /> : <IssueClosedIcon className={blur ? "rw-color-muted" : "rw-color-done"} size={15} /> :
                    <IssueOpenedIcon className={blur ? "rw-color-muted" : "rw-color-open"} size={15} />}
                <Flex direction="column" gap="1">
                    <Text size="2" weight="bold" blur={blur}>
                        <span className="rw-extra-line-space rw-highlight" dangerouslySetInnerHTML={{ __html: issue.titleHTML }} />
                        {issue.labels.nodes.map((e) => <Label key={`${issue.id}-${e.id}`} style={{
                            marginLeft: 8,
                            border: `0.5px solid #${e.color}`,
                            color: `${pSBC(0.65, `#${e.color}`)}`,
                            backgroundColor: hexToRGB(`#${e.color}`, 0.5)
                        }}>{e.name}</Label>)}
                    </Text>
                    {issue.closed ?
                        <Text size="1" weight="regular" color="muted" blur={blur}>
                            #{issue.number} by <span className="rw-accent-hover">{issue.author?.login}</span> was closed {dayjs(issue.closedAt).fromNow()}
                        </Text> :
                        <Text size="1" weight="regular" color="muted" blur={blur}>
                            #{issue.number} opened {dayjs(issue.createdAt).fromNow()} by <span className="rw-accent-hover rw-highlight">{issue.author?.login}</span>
                        </Text>}
                </Flex>
            </Flex>
            <Flex direction="row" align="center" gap="4">
                <Flex className="rw-accent-hover" direction="row" align="center" gap="1" shrink>
                    {issue.crossReferenced.filteredCount > 0 && !blur && <GitPullRequestIcon className="rw-color-muted" size={15} />}
                </Flex>
                <Flex className="rw-accent-hover" direction="row" align="center" gap="1" shrink>
                    {!blur && issue.assignees.nodes.map((e) => <img alt={e.login} className="rw-smol-avatar" key={`${issue.id}-${e.login}`} src={e.avatarUrl} />)}
                </Flex>
                <Flex className="rw-accent-hover" direction="row" align="end" gap="1" shrink>
                    {issue.commentsCount.totalCount > 0 && !blur && <>
                        <CommentIcon className="rw-color-muted" size={15} />
                        <Text size="1" color="muted">{issue.commentsCount.totalCount}</Text>
                    </>}
                </Flex>
            </Flex>
        </Flex>
    );
}
