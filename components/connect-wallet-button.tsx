import {BeproService} from '@services/bepro-service';
import React, {useContext, useEffect, useState,} from 'react';
import {ApplicationContext} from '@contexts/application';
import {changeWalletState} from '@reducers/change-wallet-connect';
import {changeCurrentAddress} from '@reducers/change-current-address';
import Modal from '@components/modal';
import Image from 'next/image';
import metamaskLogo from '@assets/metamask.png';
import ArrowRight from '@assets/icons/arrow-right';
import {changeNetwork} from '@reducers/change-network';
import {NetworkIds} from '@interfaces/enums/network-ids';

export default function ConnectWalletButton({children = null, forceLogin = false, onSuccess = () => null, onFail = () => console.log("Failed to login"), asModal = false, btnColor = `white`}) {
  const { state: {metaMaskWallet, beproInit, currentAddress}, dispatch } = useContext(ApplicationContext);

  async function connectWallet() {
    let loggedIn = false;

    try {
      const chainId = (window as any).web3?.currentProvider?.chainId;
      if (+process.env.NEXT_PUBLIC_NEEDS_CHAIN_ID !== +chainId) {
        dispatch(changeNetwork(NetworkIds[+chainId].toLowerCase()))
        return;
      } else loggedIn = await BeproService.login();
    } catch (e) {
      console.error(`Failed to login on BeproService`, e);
    }

    if (!loggedIn)
      onFail()
    else onSuccess();

    dispatch(changeWalletState(loggedIn))
    dispatch(changeCurrentAddress(BeproService.address));
  }

  useEffect(() => {
    if (!beproInit)
      return;

    let action: () => Promise<boolean|string>;

    if (forceLogin)
      action = BeproService.login;
    else action = () => Promise.resolve(BeproService.address);

    action().then((state: string|boolean) =>
                    dispatch(changeWalletState(!!state)))
            .catch(e => {
              console.error(`Error changing wallet state`, e);
            });

  }, [beproInit]);

  if (asModal)
    return (
      <Modal title="Connect your MetaMask Wallet" show={!currentAddress || !metaMaskWallet}>
        <div className="text-white-50 fs-small mtn-3 mb-5">to deposit funds and start using our service</div>
        <div className="d-flex justify-content-start px-3 bg-black py-4 align-items-center rounded cursor-pointer" onClick={connectWallet}>
          <Image src={metamaskLogo}/>
          <span className="fw-bold text-white text-uppercase ms-4 me-auto">metamask</span>
          <ArrowRight />
        </div>
      </Modal>
    )

  if (!metaMaskWallet)
    return <button className={`btn btn-md btn-${btnColor}`} onClick={connectWallet}>Connect <i className="ico-metamask ml-1" /></button>;

  return children;

}
