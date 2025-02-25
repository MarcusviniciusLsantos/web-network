import {useEffect, useState} from 'react';
import {formatNumberToNScale, formatNumberToString} from '@helpers/formatNumber';

export default function ProposalProgressBar({stakedAmount = 0, isDisputed = null, issueDisputeAmount = 0, isFinished = false, isCurrentPRMerged=false}) {
  const [issueState, setIssueState] = useState<string>(``);
  const [issueColor, setIssueColor] = useState<string>(``);
  const [percentage, setPercentage] = useState<number>(0);

  const columns = [0, 1, 2, 3, 3,]

  function toPercent(value = 0, total = 0, decimals = 2) {
    return ((value / total) * 100).toFixed(decimals);
  }

  function toRepresentationPercent(value = 0, total = 5) {
    return value > 3 ? 100 : (value * 100) / total;
  }

  function getStateColor() {
    if (isDisputed || (!isCurrentPRMerged && isFinished === true))
      return `danger`

    if (isDisputed === false && isFinished === true && isCurrentPRMerged)
      return 'success'

    if (isDisputed === false)
      return `purple`;

    return `white-50`;
  }

  function getStateText() {
    if (isDisputed === true || (!isCurrentPRMerged && isFinished === true))
      return `Failed`

    if (isDisputed === false && isFinished === false)
      return `Open for dispute`;
    
    if (isDisputed === false && isFinished === true && isCurrentPRMerged)
      return `Accepted`;

    return `Waiting`;
  }

  function loadDisputeState() {
    setIssueState(getStateText());
    setIssueColor(getStateColor());
    setPercentage(+toPercent(issueDisputeAmount, stakedAmount));
  }

  function renderColumn(dotLabel, index) {
    const dotClass = `rounded-circle bg-${!percentage || dotLabel >= percentage ? `dark` : issueColor}`;
    const style = {left: index === 0 ? `1%` : `${index*20}%`};
    const dotStyle = {width: `10px`, height: `10px`};
    const isLastColumn = index+1 === columns.length

    return <>
      <div className="position-absolute d-flex align-items-center flex-column" style={style}>
        <div className={dotClass} style={dotStyle}>
          <div className={`caption ${isLastColumn ? `text-${issueColor}` : `text-white`} mt-4 ms-1`}>{isLastColumn ? `>` : ``}{dotLabel}%</div>
        </div>
      </div>
    </>
  }

  useEffect(loadDisputeState, [stakedAmount, issueDisputeAmount, isDisputed, isFinished]);

  return <>
    <div className="row mb-2 proposal-progress-bar">
      <div className="col d-flex justify-content-between">
        <h4 className={`h4 text-capitalize text-${issueColor}`}>{issueState}</h4>
        <div className="fs-small smallCaption d-flex align-items-center">
          <span className={`text-${issueColor}`}>{formatNumberToString(issueDisputeAmount, 2)} </span> /{formatNumberToNScale(stakedAmount)} ORACLES <span className={`text-${issueColor}`}> ({percentage}%)</span>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="ms-2 col-12 position-relative">
        <div className="progress bg-dark">
          <div className={`progress-bar bg-${issueColor}`} role="progressbar" style={{width: `${toRepresentationPercent(percentage)}%`}}>
            {columns.map(renderColumn)}
          </div>
        </div>
      </div>
    </div>
  </>
}
