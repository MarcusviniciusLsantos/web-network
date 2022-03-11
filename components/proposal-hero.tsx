import Avatar from "components/avatar";
import GithubInfo from "components/github-info";
import CustomContainer from "./custom-container";
import { useIssue } from "contexts/issue";
import DateLabel from "./date-label";
import { useTranslation } from "next-i18next";
import PriceConversor from "./price-conversor";
import {Proposal} from 'interfaces/proposal'
interface IProposalHeroProps{
  proposal: Proposal;
}

export default function ProposalHero({proposal}: IProposalHeroProps) {
  const { activeIssue } = useIssue();
  const { t } = useTranslation(['proposal'])
  return (
    <div className="banner-shadow">
      <CustomContainer>
        <div className="d-flex flex-row">
          <div className="col-10 row">

            <div className="d-flex flex-row">
              <h4 className="me-2 text-white-70">#{proposal?.issue?.id}</h4>
              <h4>{proposal?.issue?.title}</h4>
            </div>

            <div className="mt-3 pt-1 d-inline-flex align-items-center justify-content-md-start gap-20">
              <h4>{t('proposal:title')}</h4>
              <h4 className="me-2 text-white-70">#{proposal?.id}</h4>
            </div>

            <div className="mt-3 pt-1 d-inline-flex align-items-center justify-content-md-start gap-20">
              <div className="d-flex align-items-center">
                <Avatar
                  className="me-2"
                  userLogin={proposal?.githubLogin}
                />{" "}
                <GithubInfo
                  parent="hero"
                  variant="user"
                  label={[`@`, proposal?.githubLogin].join(``)}
                />
              </div>

              {activeIssue?.createdAt && (
                <DateLabel
                  date={activeIssue?.createdAt}
                  className="text-white"
                />
              )}
            </div>
          </div>

          <div className="col-2 d-flex align-items-center justify-content-center">
            <PriceConversor
              currentValue={proposal?.issue?.amount || 0}
              currency="BEPRO"
            />
          </div>

        </div>
      </CustomContainer>
    </div>
  );
}
