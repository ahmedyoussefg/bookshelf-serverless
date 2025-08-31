import { triggerLogout } from "../utils/auth-logout-helper";

function LogoutButton() {
  return (
    <button
      onClick={triggerLogout}
      className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 hover:cursor-pointer transition"
    >
      Log Out
    </button>
  );
}

export default LogoutButton;
