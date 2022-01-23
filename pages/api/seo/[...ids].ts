import models from '@db/models';
import {NextApiRequest, NextApiResponse} from 'next';
import {generateCard} from '@helpers/seo/create-card-bounty'
import IpfsStorage from '@services/ipfs-service';

async function get(req: NextApiRequest, res: NextApiResponse) {
  const {ids: [repoId, ghId]} = req.query;
  const issueId = [repoId, ghId].join(`/`);

  const include = [
    { association: 'developers' },
    { association: 'pullRequests' },
    { association: 'mergeProposals' },
    { association: 'repository' },
  ]

  const issue = await models.issue.findOne({
    where: {issueId},
    include
  })

  if (!issue)
    return res.status(404).json(null);

  const [, repo] = issue.repository.githubPath.split(`/`);

  const card = await generateCard({
    state: issue.state,
    issueId: ghId,
    title: issue.title,
    repo,
    ammount: issue.amount,
    working: issue.working?.length || 0,
    pr: issue.pullRequests?.length || 0,
    proposal: issue.mergeProposals?.length || 0,
  })

  var img = Buffer.from(card.buffer, 'base64');
  const {hash} = await IpfsStorage.add(img)
  const seoImage = `${process.env.NEXT_PUBLIC_IPFS_BASE}/${hash}`

  await issue.update({
    seoImage,
  })

  return res.status(200).json({seoImage});
}

export default async function GetIssues(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
    case 'get':
      await get(req, res);
      break;

    default:
      res.status(405).json(`Method not allowed`);
  }

  res.end();
}
