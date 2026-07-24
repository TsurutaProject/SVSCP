import { completeOnboarding } from "@/app/onboarding/actions";

type OnboardingFormProps = {
  errorMessage?: string;
};

export function OnboardingForm({ errorMessage }: OnboardingFormProps) {
  return (
    <form action={completeOnboarding}>
      <div>
        <label htmlFor="displayName">表示名</label>
        <br />
        <input id="displayName" name="displayName" type="text" maxLength={50} required />
      </div>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <button type="submit">はじめる</button>
    </form>
  );
}
