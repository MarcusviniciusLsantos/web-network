import { useState } from "react";

import { useTranslation } from "next-i18next";

import InputNumber from "components/input-number";
import Step from "components/step";

import { useNetworkSettings } from "contexts/network-settings";

import { StepWrapperProps } from "interfaces/stepper";

import NetworkContractSettings from "./network-contract-settings";
import ThemeColors from "./theme-colors";

const Section = ({ children = undefined, title }) => (
  <div className="row mx-0 px-0 mb-2 mt-1">
    <div className="row mx-0 px-0 mb-2">
      <span className="caption-small text-white">
        {title}
      </span>
    </div>

    {children}
  </div>
);

const ParameterInput = ({ label, description = null, symbol, value, onChange, error = false, onBlur = undefined}) => (
  <div className="form-group col">
    <InputNumber
      classSymbol={"text-primary"}
      symbol={symbol}
      value={value}
      label={label}
      description={description}
      min={0}
      placeholder={"0"}
      onValueChange={onChange}
      onBlur={onBlur}
      error={error}
      thousandSeparator
    />
  </div>
);

export default function NetworkSettingsStep({ activeStep, index, validated, handleClick } : StepWrapperProps) {
  const { t } = useTranslation(["common", "custom-network"]);

  const [address, setAddress] = useState("");

  const { fields, settings } = useNetworkSettings();

  const handleAddressChange = e => setAddress(e.target.value);
  const handleColorChange = value => fields.colors.setter(value);
  const handleCloseFeeChange = param => fields.closeFee.setter(param.floatValue);
  const handleCancelFeeChange = param => fields.cancelFee.setter(param.floatValue);
  const handleAddressBlur = () => fields.treasury.setter(address);

  return (
    <Step
      title={t("custom-network:steps.network-settings.title")}
      index={index}
      activeStep={activeStep}
      validated={validated}
      handleClick={handleClick}
    >
      <Section title={t("custom-network:steps.network-settings.fields.colors.label")}>
        <div className="col">
          <ThemeColors
            colors={settings?.theme?.colors}
            similar={settings?.theme?.similar}
            setColor={handleColorChange}
          />
        </div>
      </Section>

      <Section title={t("custom-network:steps.network-settings.fields.fees.title")}>
        <div className="form-group col-8">
          <label className="caption-small mb-2">
            {t("custom-network:steps.treasury.fields.address.label")}
          </label>

          <input 
            type="text" 
            className="form-control" 
            value={address}
            onChange={handleAddressChange}
            onBlur={handleAddressBlur}
          />

          {
            settings?.treasury?.address?.validated === false && 
            <small className="small-info text-danger">
              {t("custom-network:steps.treasury.fields.address.error")}
            </small>
          }
        </div>

        <ParameterInput 
          label={t("custom-network:steps.treasury.fields.cancel-fee.label")}
          symbol="%"
          value={settings?.treasury?.cancelFee?.value}
          error={settings?.treasury?.cancelFee?.validated === false}
          onChange={handleCancelFeeChange}
        />

        <ParameterInput 
          label={t("custom-network:steps.treasury.fields.close-fee.label")}
          symbol="%"
          value={settings?.treasury?.closeFee?.value}
          error={settings?.treasury?.closeFee?.validated === false}
          onChange={handleCloseFeeChange}
        />
      </Section>

      <Section title={t("custom-network:steps.network-settings.fields.other-settings.title")}>
        <small className="small-info text-gray my-2">
          {t("custom-network:steps.network-settings.fields.other-settings.parameters-warning")}
        </small>

        <NetworkContractSettings/>
      </Section>
    </Step>
  );
}