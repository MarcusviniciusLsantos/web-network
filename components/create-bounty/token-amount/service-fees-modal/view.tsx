import { useTranslation } from "next-i18next";

import Modal from "components/modal";

import { DAPPKIT_LINK } from "helpers/constants";

import { DistributedAmounts } from "interfaces/proposal";

import ServiceFeesModalRow from "./row/view";

interface ServiceFeesModalProps {
  show: boolean;
  onClose: () => void;
  symbol: string;
  distributions: DistributedAmounts;
}

export default function ServiceFeesModalView({
  show,
  onClose,
  symbol,
  distributions,
}: ServiceFeesModalProps) {
  const { t } = useTranslation(["common", "bounty"]);

  return (
    <Modal show={show} title={"Service Fees"} onCloseClick={onClose}>
      <div className="px-3">
        <span>
          You Can find more information in our{" "}
          <a href={DAPPKIT_LINK} target="_blank">
            Documentation
          </a>
        </span>
        <ServiceFeesModalRow
          label={t("bounty:proposal-merger")}
          percentage={distributions?.mergerAmount?.percentage}
          amount={distributions?.mergerAmount?.value}
          symbol={symbol}
        />
        <ServiceFeesModalRow
          label={t("bounty:network-fee")}
          percentage={distributions?.treasuryAmount?.percentage}
          amount={distributions?.treasuryAmount?.value}
          symbol={symbol}
        />
        <ServiceFeesModalRow
          label={t("bounty:proposal-creator")}
          percentage={distributions?.proposerAmount?.percentage}
          amount={distributions?.proposerAmount?.value}
          symbol={symbol}
          border={false}
        />
      </div>
    </Modal>
  );
}
