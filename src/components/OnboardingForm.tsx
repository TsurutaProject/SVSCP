import { completeOnboarding } from "@/app/onboarding/actions";
import styles from "./authForm.module.css";

type OnboardingFormProps = {
  errorMessage?: string;
};

export function OnboardingForm({ errorMessage }: OnboardingFormProps) {
  return (
    <form className={styles.form} action={completeOnboarding}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="displayName">
          表示名
        </label>
        <input
          className={styles.input}
          id="displayName"
          name="displayName"
          type="text"
          maxLength={50}
          required
        />
      </div>

      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}

      <div className={styles.actions}>
        <button className={`${styles.button} ${styles.buttonPrimary}`} type="submit">
          はじめる
        </button>
      </div>
    </form>
  );
}
