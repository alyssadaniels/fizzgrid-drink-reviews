import TypedInput from "../../common/ui/TypedInput";
import LogoHeader from "../../common/LogoHeader";
import TypedInputMulti from "../../common/ui/TypedInputMulti";
import FormContainer from "../../common/layouts/FormContainer";
import { useEffect } from "react";
import { useReportIssue } from "../../../api-hooks/actions/useReportIssue";

/**
 * Form for reporting an issue
 * @returns ReportIssueForm component
 */
function ReportIssueForm({ onSuccess }: { onSuccess(): void }) {
    const { reportIssue, isPending, error, isSuccess } = useReportIssue();

    useEffect(() => {
        if (isSuccess) onSuccess();
    }, [isSuccess]);

    return (
        <FormContainer
            submitText="Submit"
            onSubmit={(event) => {
                reportIssue({
                    summary: event.currentTarget.summary.value,
                    details: event.currentTarget.details.value,
                    email: event.currentTarget.email.value,
                });
            }}
            formName={"ReportIssueForm"}
            isLoading={isPending}
            errorMessage={error?.message}
        >
            <LogoHeader title="Report a Problem" />

            {/* inputs */}
            <TypedInput
                label="Issue Summary"
                placeholder=""
                maxLength={100}
                id="summary"
                showMaxLength={true}
                showCharacters={true}
            />
            <TypedInputMulti
                label="Details"
                placeholder=""
                maxLength={4096}
                id="details"
                showMaxLength={true}
            />

            <br />
            <p className="text-sm text-left text-background-dark">
                Get notified when issue is resolved
            </p>
            <TypedInput
                label="Email (optional)"
                placeholder=""
                maxLength={300}
                id="email"
                showMaxLength={true}
                showCharacters={true}
                isRequired={false}
            />
        </FormContainer>
    );
}

export default ReportIssueForm;
