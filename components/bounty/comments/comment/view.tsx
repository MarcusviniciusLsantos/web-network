import { useTranslation } from "next-i18next";

import {
  formatDate,
  getDifferenceBetweenDates,
  getTimeDifferenceInWords,
} from "helpers/formatDate";
import { truncateAddress } from "helpers/truncate-address";

import { User } from "interfaces/api";

import AvatarOrIdenticon from "../../../avatar-or-identicon";
import MarkedRender from "../../../MarkedRender";
import { FlexColumn } from "components/common/flex-box/view";

export interface CommentsProps {
  id: number;
  comment: string;
  hidden: boolean;
  type: string;
  issueId: number;
  proposalId?: number;
  deliberableId?: number;
  userId: number;
  userAddress: string;
  replyId?: number;
  updatedAt: Date;
  createdAt: Date;
  user: User;
}

export default function Comment({
  comment,
  userAddress,
  user,
  updatedAt,
  hidden,
}: CommentsProps) {
  const { t } = useTranslation("bounty");

  if (hidden) return;

  return (
    <div className="border-radius-8 p-3 bg-gray-800 mb-3">
      <div className="d-flex align-items-baseline justify-content-between mb-2">
        <div className="d-flex align-items-baseline">
          <FlexColumn className="justify-content-center">
            <AvatarOrIdenticon
              user={user?.githubLogin}
              address={userAddress}
              size="xsm"
            />
          </FlexColumn>
          <FlexColumn className="justify-content-center">
            <span className="xs-medium ms-2">
              {user?.githubLogin
                ? `@${user?.githubLogin}`
                : truncateAddress(userAddress)}{" "}
            </span>
          </FlexColumn>
          <FlexColumn className="align-items-baseline">
            <span className="p-small text-gray-500 ms-2">
              {updatedAt && getTimeDifferenceInWords(updatedAt, new Date())}
            </span>
          </FlexColumn>
        </div>
        <div className="d-flex flex-column text-center justify-content-center align-items-center border-radius-4 bg-gray-850">
          <span className="mx-2 mb-2">. . .</span>
        </div>
      </div>

      <MarkedRender
        className="p-small mb-0 comment"
        source={comment || t("no-comments-available")}
      />
    </div>
  );
}
