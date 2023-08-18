import { IssueBigNumberData } from "interfaces/issue-data";

export interface PageActionsViewProps {
  handleEditIssue: () => void;
  handlePullrequest: (arg: {
    title: string;
    description: string;
  }) => Promise<void>;
  handleStartWorking: () => Promise<void>;
  bounty: IssueBigNumberData;
  isWalletConnected: boolean;
  isCreatePr: boolean;
  isCreateProposal: boolean;
  isExecuting: boolean;
  showPRModal: boolean;
  handleShowPRModal: (v: boolean) => void;
  ghVisibility: boolean;
  isUpdateAmountButton: boolean;
  isStartWorkingButton: boolean;
  isForkRepositoryLink: boolean;
  isEditButton: boolean;
  updateBountyData: (updatePrData?: boolean) => void;
}

export interface PageActionsControllerProps {
  isRepoForked?: boolean;
  addNewComment?: (comment: string) => void;
  handleEditIssue?: () => void;
  isEditIssue?: boolean;
  currentBounty: IssueBigNumberData;
  updateBountyData: (updatePrData?: boolean) => void;
  currentUserId?: number;
}
