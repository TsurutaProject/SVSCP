import { signIn, signUp } from "@/app/login/actions";

type LoginFormProps = {
  errorMessage?: string;
  infoMessage?: string;
};

export function LoginForm({ errorMessage, infoMessage }: LoginFormProps) {
  return (
    <form>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <br />
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label htmlFor="password">パスワード</label>
        <br />
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={6}
          required
        />
      </div>

      {errorMessage && <p role="alert">{errorMessage}</p>}
      {infoMessage && <p>{infoMessage}</p>}

      <div>
        <button type="submit" formAction={signIn}>
          ログイン
        </button>
        <button type="submit" formAction={signUp}>
          新規登録
        </button>
      </div>
    </form>
  );
}
