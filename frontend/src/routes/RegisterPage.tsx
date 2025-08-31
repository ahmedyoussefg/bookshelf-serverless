import PageLayout from "../components/PageLayout";
import AuthForm from "../components/AuthForm";
import { api } from "../api";
import AuthSwitchLink from "../components/AuthSwitchLink";
import WelcomeLogo from "../components/WelcomeLogo";

function RegisterPage() {
  const handleSubmit = async (username: string, pwd: string) => {
    const res = await api.post("/auth/register", {
      username: username,
      password: pwd,
    });
    console.log("Registered successfully: ", res);
    return res;
  };
  return (
    <PageLayout>
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <WelcomeLogo />
        <AuthForm
          handleAuthSubmit={handleSubmit}
          buttonLabel="Register"
          isLoginForm={false}
        />
        <AuthSwitchLink isRegisterPage={true}></AuthSwitchLink>
      </div>
    </PageLayout>
  );
}

export default RegisterPage;
