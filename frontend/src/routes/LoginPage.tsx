import PageLayout from "../components/PageLayout";
import AuthForm from "../components/AuthForm";
import { api } from "../api";
import AuthSwitchLink from "../components/AuthSwitchLink";
import WelcomeLogo from "../components/WelcomeLogo";

function LoginPage() {
  const handleSubmit = async (username: string, pwd: string) => {
    const res = await api.post("/auth/login", {
      username: username,
      password: pwd,
    });
    console.log("Logged in successfully: ", res);
    return res;
  };
  return (
    <PageLayout>
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <WelcomeLogo />
        <AuthForm
          handleAuthSubmit={handleSubmit}
          buttonLabel="Log In"
          isLoginForm={true}
        />
        <AuthSwitchLink isRegisterPage={false}></AuthSwitchLink>
      </div>
    </PageLayout>
  );
}

export default LoginPage;
