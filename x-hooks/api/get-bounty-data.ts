import { ParsedUrlQuery } from "querystring";

import {
  IssueData,
  pullRequest,
} from "interfaces/issue-data";

import { api } from "services/api";

import useOctokit from "x-hooks/use-octokit";

/**
 * Get bounty from api based on query filters
 * @param query current url query
 * @returns bounty
 */
export async function getBountyData(query: ParsedUrlQuery): Promise<IssueData | null> {
  const { repoId, id: ghId, network: networkName, chain: chainName } = query;

  return api
    .get<IssueData>(`/issue/${repoId}/${ghId}/${networkName}/${chainName}`)
    .then(({ data }) => data)
    .catch(() => null);
}

/**
 * Get comments in github on bounty from api based on query filters
 * @param githubPath and @param githubId
 * @returns list of comments
 */
export async function getBountyComments(repositoryPath: string, id: number) {
  return useOctokit().getIssueOrPullRequestComments(repositoryPath, id);
}

export async function getPullRequestsDetails(repositoryPath: string,
                                             pullRequests: pullRequest[]): Promise<pullRequest[]> {

  return Promise.all([
    ...pullRequests.map((pullRequest) => useOctokit()
        .getPullRequestDetails(repositoryPath, +pullRequest.githubId)
        .then((details) =>  ({
                ...pullRequest,
                isMergeable: details?.mergeable === "MERGEABLE",
                merged: details?.merged,
                state: details?.state,
                approvals: details?.approvals,
                hash: details?.hash,
        }))),
  ])
}
