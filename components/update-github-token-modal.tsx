import {signIn} from "next-auth/react";
import {useTranslation} from "next-i18next";
import {setCookie} from "nookies";

import Button from "components/button";
import Modal from "components/modal";

import {useAppState} from "../contexts/app-state";

export default function UpdateGithubTokenModal({
                                                 redirectTo,
                                                 description,
                                                 isVisible = false,
  setVisible,
}) {
  const { t } = useTranslation(["common", "custom-network"]);
  const {state} = useAppState();

  function handleClose() {
    setVisible?.(false);
  }

  function handleConfirm() {
    setCookie(null, `updated-github-token:${state.currentUser?.walletAddress}`, "true", {
      maxAge: 24 * 60 * 60,
      path: "/"
    });

    return signIn("github", { callbackUrl: redirectTo });
  }

  return (
    <Modal
      show={isVisible}
      title={t("custom-network:modals.update-github-token.title")}
      centerTitle
      onCloseClick={handleClose}
    >
      <div>
        <div className="d-flex justify-content-center mb-2 mx-2 text-center flex-column">
          <p className="caption-small text-gray">{description}</p>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <Button color="dark-gray" onClick={handleClose}>
            <span>{t("actions.cancel")}</span>
          </Button>

          <Button color="primary" onClick={handleConfirm}>
            <span>
              {t("custom-network:modals.update-github-token.update-now")}
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
