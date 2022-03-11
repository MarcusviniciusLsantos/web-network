import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useContext, useEffect, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Stepper from '@components/stepper'
import CustomContainer from '@components/custom-container'
import ConnectWalletButton from '@components/connect-wallet-button'
import CreatingNetworkLoader from '@components/creating-network-loader'

import LockBeproStep from '@components/custom-network/lock-bepro-step'
import NetworkInformationStep from '@components/custom-network/network-information-step'
import SelectRepositoriesStep from '@components/custom-network/select-repositories-step'

import { addToast } from '@contexts/reducers/add-toast'
import { ApplicationContext } from '@contexts/application'
import { useAuthentication } from '@contexts/authentication'

import { isSameSet } from '@helpers/array'
import { isColorsSimilar } from '@helpers/colors'
import { psReadAsText } from '@helpers/file-reader'
import { DefaultNetworkInformation } from '@helpers/custom-network'

import { BeproService } from '@services/bepro-service'

import useApi from '@x-hooks/use-api'
import useNetwork from '@x-hooks/use-network'
import useOctokit from '@x-hooks/use-octokit'

import { BEPRO_NETWORK_NAME } from 'env'

export default function NewNetwork() {
  const router = useRouter()

  const { t } = useTranslation(['common', 'custom-network'])

  const [currentStep, setCurrentStep] = useState(1)
  const [creatingNetwork, setCreatingNetwork] = useState(false)
  const [steps, setSteps] = useState(DefaultNetworkInformation)
  const [networkFactoryStarted, setNetworkFactoryStarted] = useState(false)

  const { createNetwork } = useApi()
  const { listUserRepos } = useOctokit()
  const { network, getURLWithNetwork, colorsToCSS, DefaultTheme } = useNetwork()

  const { dispatch } = useContext(ApplicationContext)

  const { user, wallet, beproServiceStarted } = useAuthentication()

  function changeColor(newColor) {
    const tmpSteps = Object.assign({}, steps)

    tmpSteps.network.data.colors.data[newColor.label] = newColor.value

    setSteps(tmpSteps)
  }

  function handleNetworkDataChange(newData) {
    const tmpSteps = Object.assign({}, steps)

    tmpSteps.network.data[newData.label] = newData.value

    setSteps(tmpSteps)
  }

  function handleCheckRepository(repositoryName) {
    const tmpSteps = Object.assign({}, steps)

    const repositoryIndex = tmpSteps.repositories.data.findIndex(
      (repo) => repo.name === repositoryName
    )

    tmpSteps.repositories.data[repositoryIndex].checked =
      !tmpSteps.repositories.data[repositoryIndex].checked

    setSteps(tmpSteps)
  }

  function handleCheckPermission(check) {
    const tmpSteps = Object.assign({}, steps)

    tmpSteps.repositories.permission = check

    setSteps(tmpSteps)
  }

  function handleLockDataChange(newData) {
    const tmpSteps = Object.assign({}, steps)

    tmpSteps.lock[newData.label] = newData.value

    setSteps(tmpSteps)
  }

  function handleChangeStep(stepToGo: number) {
    const stepsNames = {
      1: 'lock',
      2: 'network',
      3: 'repositories'
    }

    let canGo = false

    if (stepToGo !== currentStep) {
      if (stepToGo < currentStep) canGo = true
      else if (steps[stepsNames[stepToGo - 1]].validated) canGo = true
    }

    if (canGo) setCurrentStep(stepToGo)
  }

  function handleCreateNetwork() {
    if (!user?.login || !wallet?.address) return

    setCreatingNetwork(true)

    BeproService.createNetwork()
      .then((receipt) => {
        BeproService.getNetworkAdressByCreator(wallet.address).then(
          async (networkAddress) => {
            const networkData = steps.network.data
            const repositoriesData = steps.repositories

            await BeproService.claimNetworkGovernor(networkAddress)

            const json = {
              name: networkData.displayName.data,
              description: networkData.networkDescription,
              colors: JSON.stringify(networkData.colors.data),
              logoIcon: await psReadAsText(networkData.logoIcon.raw),
              fullLogo: await psReadAsText(networkData.fullLogo.raw),
              repositories: JSON.stringify(
                repositoriesData.data
                  .filter((repo) => repo.checked)
                  .map(({ name, fullName }) => ({ name, fullName }))
              ),
              botPermission: repositoriesData.permission,
              creator: wallet.address,
              githubLogin: user.login,
              networkAddress,
              accessToken: user?.accessToken
            }

            createNetwork(json).then((result) => {
              router.push(
                getURLWithNetwork('/account/my-network/settings', {
                  network: json.name
                })
              )

              setCreatingNetwork(false)
            })
          }
        )
      })
      .catch((error) => {
        dispatch(
          addToast({
            type: 'danger',
            title: t('actions.failed'),
            content: t('custom-network:errors.failed-to-create-network', {
              error
            })
          })
        )

        setCreatingNetwork(false)
        console.log(error)
      })
  }

  useEffect(() => {
    if (!network) return

    if (network.name !== BEPRO_NETWORK_NAME)
      router.push(
        getURLWithNetwork('/account', { network: BEPRO_NETWORK_NAME })
      )
    else if (!Object.keys(steps.network.data.colors.data).length) {
      const tmpSteps = Object.assign({}, steps)

      tmpSteps.network.data.colors.data = network.colors || DefaultTheme()

      setSteps(tmpSteps)
    }
  }, [network])

  useEffect(() => {
    if (user?.login)
      listUserRepos(user.login).then(({ data }) => {
        const repositories = data.items.map((repo) => ({
          checked: false,
          name: repo.name,
          fullName: repo.full_name
        }))

        const tmpSteps = Object.assign({}, steps)

        tmpSteps.repositories.data = repositories

        setSteps(tmpSteps)
      })
  }, [user?.login])

  useEffect(() => {
    if (wallet?.address && beproServiceStarted && networkFactoryStarted) {
      BeproService.getTokensLockedByAddress(wallet.address)
        .then((value) => {
          handleLockDataChange({ label: 'amountLocked', value })
        })
        .catch(console.log)

      handleLockDataChange({
        label: 'amountNeeded',
        value: BeproService.operatorAmount
      })
    }
  }, [
    wallet?.address,
    wallet?.balance,
    beproServiceStarted,
    networkFactoryStarted
  ])

  useEffect(() => {
    //Validate Locked Tokens
    const lockData = steps.lock

    const lockValidated = lockData.amountLocked >= BeproService.operatorAmount

    if (lockValidated !== steps.lock.validated) {
      const tmpSteps = Object.assign({}, steps)

      tmpSteps.lock.validated = lockValidated

      setSteps(tmpSteps)
    }

    // Validate Network informations
    const networkData = steps.network.data

    const networkValidated = [
      networkData.fullLogo.preview !== '',
      networkData.logoIcon.preview !== '',
      networkData.fullLogo.raw?.type?.includes('image/svg'),
      networkData.logoIcon.raw?.type?.includes('image/svg'),
      networkData.displayName.validated,
      networkData.networkDescription.trim() !== '',
      !networkData.colors.similar.length // All colors should be different
    ].every((condition) => condition === true)

    if (networkValidated !== steps.network.validated) {
      const tmpSteps = Object.assign({}, steps)

      tmpSteps.network.validated = networkValidated

      setSteps(tmpSteps)
    }

    // Validate Repositories
    const repositoriesData = steps.repositories.data
    const repositoriesValidated =
      steps.repositories.permission &&
      repositoriesData.some((repository) => repository.checked)

    if (repositoriesValidated !== steps.repositories.validated) {
      const tmpSteps = Object.assign({}, steps)

      tmpSteps.repositories.validated = repositoriesValidated

      setSteps(tmpSteps)
    }
  }, [steps])

  useEffect(() => {
    const networkData = steps.network.data

    if (networkData.colors.data.primary) {
      const similarColors = []
      const colors = networkData.colors.data

      similarColors.push(
        ...isColorsSimilar({ label: 'text', code: colors.text }, [
          { label: 'primary', code: colors.primary },
          //{ label: 'secondary', code: colors.secondary },
          { label: 'background', code: colors.background },
          { label: 'shadow', code: colors.shadow }
        ])
      )

      similarColors.push(
        ...isColorsSimilar({ label: 'background', code: colors.background }, [
          { label: 'success', code: colors.success },
          { label: 'fail', code: colors.fail },
          { label: 'warning', code: colors.warning }
        ])
      )

      if (
        !isSameSet(new Set(similarColors), new Set(networkData.colors.similar))
      ) {
        const tmpSteps = Object.assign({}, steps)

        tmpSteps.network.data.colors.similar = similarColors

        setSteps(tmpSteps)
      }
    }
  }, [steps])

  useEffect(() => {
    if (beproServiceStarted)
      BeproService.startNetworkFactory()
        .then(setNetworkFactoryStarted)
        .catch((error) =>
          console.log('Failed to start the Network Factory', error)
        )
  }, [beproServiceStarted])

  return (
    <div className="new-network">
      <style>{colorsToCSS(steps.network.data.colors.data)}</style>
      <ConnectWalletButton asModal={true} />

      {(creatingNetwork && <CreatingNetworkLoader />) || ''}

      <CustomContainer>
        <div className="mt-5 pt-5">
          <Stepper>
            <LockBeproStep
              data={steps.lock}
              step={1}
              currentStep={currentStep}
              handleChangeStep={handleChangeStep}
              handleChange={handleLockDataChange}
              balance={{
                beproAvailable: wallet?.balance?.bepro,
                oraclesAvailable:
                  +wallet?.balance?.oracles?.tokensLocked -
                  wallet?.balance?.oracles?.delegatedToOthers,
                tokensLocked: wallet?.balance?.oracles?.tokensLocked
              }}
            />

            <NetworkInformationStep
              data={steps.network.data}
              setColor={changeColor}
              changedDataHandler={handleNetworkDataChange}
              validated={steps.network.validated}
              step={2}
              currentStep={currentStep}
              handleChangeStep={handleChangeStep}
            />

            <SelectRepositoriesStep
              data={steps.repositories}
              onClick={handleCheckRepository}
              githubLogin={user?.login}
              validated={steps.repositories.validated}
              step={3}
              currentStep={currentStep}
              handleChangeStep={handleChangeStep}
              handleFinish={handleCreateNetwork}
              handleCheckPermission={handleCheckPermission}
            />
          </Stepper>
        </div>
      </CustomContainer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'custom-network',
        'connect-wallet-button'
      ]))
    }
  }
}
