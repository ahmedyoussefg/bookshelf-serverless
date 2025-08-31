import Logo from "./Logo";
import LogoutButton from "./LogoutButton";

interface Props {
  username: string | undefined;
}
function Header({ username }: Props) {
  return (
    <header className="flex justify-between items-center pl-7 pt-6 pr-4 pb-1 bg-amber-100 shadow-md rounded-2xl">
      <Logo />
      <div className="flex items-center gap-2.5">
        <span className="text-amber-900 font-medium selection:bg-amber-200">
          Hello, {username}!
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}

export default Header;
