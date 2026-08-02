import { signIn, signUp } from "@/app/login/actions";
import styles from "./authForm.module.css";

type LoginFormProps = {
  errorMessage?: string;
  infoMessage?: string;
};

export function LoginForm({ errorMessage, infoMessage }: LoginFormProps) {
  return (
    <form className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          メールアドレス
        </label>
        <input
          className={styles.input}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          パスワード
        </label>
        <input
          className={styles.input}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={6}
          required
        />
      </div>

      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
      {infoMessage && <p className={styles.info}>{infoMessage}</p>}

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          type="submit"
          formAction={signIn}
        >
          ログイン
        </button>
        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          type="submit"
          formAction={signUp}
        >
          新規登録
        </button>
      </div>
    </form>
  );
}
