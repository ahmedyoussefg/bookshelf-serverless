import Logo from "./Logo";

function WelcomeLogo() {
  return (
    <>
      <Logo></Logo>
      <h2 className="text-l font-bold text-left mb-6 text-amber-700 animate-pulse [animation-duration:3s]">
        Your personal library, organized.
      </h2>
    </>
  );
}

export default WelcomeLogo;
