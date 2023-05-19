import Translation from "components/translation";

export default function ReviewsNumber({ reviewers, className }: { reviewers: number; className?: string}) {
  return (
    <div className={`d-flex align-items-center text-center ${className}`}>
      <span className="label-m text-white">
        {reviewers}
      </span>

      <span className="label-m text-uppercase text-gray-500 ml-1">
        <Translation
          ns="pull-request"
          label="review"
          params={{ count: reviewers }}
        />
      </span>
    </div>
  );
}
