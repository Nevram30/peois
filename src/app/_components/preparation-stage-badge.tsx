import {
  PREPARATION_STAGE_BADGE,
  PREPARATION_STAGE_DESCRIPTION,
  PREPARATION_STAGE_LABEL,
  type PreparationStageValue,
} from "~/lib/preparation-stage";

// A project's preparation stage (For Survey / For Plans / For POW). Renders
// nothing for projects that predate stages.
export const PreparationStageBadge = ({
  stage,
  className = "",
}: {
  stage: string | null | undefined;
  className?: string;
}) => {
  if (!stage) return null;
  const key = stage as PreparationStageValue;
  return (
    <span
      title={PREPARATION_STAGE_DESCRIPTION[key]}
      className={`inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${PREPARATION_STAGE_BADGE[key] ?? "border-gray-200 bg-gray-50 text-gray-700"} ${className}`}
    >
      {PREPARATION_STAGE_LABEL[key] ?? stage}
    </span>
  );
};
