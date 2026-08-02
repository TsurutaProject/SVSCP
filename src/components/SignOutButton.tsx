import { signOut } from "@/app/actions";
import styles from "./SignOutButton.module.css";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button className={styles.button} type="submit">
        ログアウト
      </button>
    </form>
  );
}
