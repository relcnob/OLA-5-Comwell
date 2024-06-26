import InputField from "@/components/formField/InputField";
import BodyText from "@/components/text/bodyText/BodyText";
import { useState, FormEvent, useContext } from "react";
import { SignInValidators } from "../../../utils/formTypes";
import InputError from "@/components/formField/InputError";
import { AuthContext } from "@/context/AuthContext";
import { setCookie } from "cookies-next";
import "dotenv/config";

export default function SignInForm({
  toggleRegisterDrawer,
  isLoginVisible,
}: {
  toggleRegisterDrawer: () => void;
  isLoginVisible: boolean;
}) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { onSignInSuccess, authState } = useContext(AuthContext);

  authState.isAuthenticated && console.log(authState.userData);

  const validators: SignInValidators = {
    loginEmail: {
      fieldName: "email",
      validationFunction: () =>
        loginEmail.includes("@") && loginEmail.includes("."),
    },
    loginPassword: {
      fieldName: "password",
      validationFunction: () => loginPassword !== "",
    },
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    Object.entries(validators).forEach(([key, value]) => {
      if (!value.validationFunction()) {
        setValidationErrors((prev) =>
          Array.from(new Set([...prev, value.fieldName]))
        );
      } else {
        setValidationErrors((prev) =>
          prev.filter((e) => e !== value.fieldName)
        );
      }
    });

    if (
      validators.loginEmail.validationFunction() &&
      validators.loginPassword.validationFunction()
    ) {
      fetch(`${process.env.NEXT_PUBLIC_BE_HOST}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              // Display an error if the user doesn't exist or the password is wrong
              setUnauthorizedError(true);
              throw new Error(`Server error! Message: ${errorData.message}`);
            });
          }
          // Run the callback from the auth context to check if the cookie token in still valid
          onSignInSuccess();
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setCookie("token_fe", data.access_token);
          // remove error if the login was successful
          setUnauthorizedError(false);
          console.log("Response:", "login was successful");
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={`absolute flex flex-col bg-slate-50 rounded-lg right-0 top-16 ${
        isLoginVisible ? "" : "hidden"
      }`}
    >
      <div className={`px-4 pt-6 pb-3 flex flex-col gap-4`}>
        <InputField
          onChange={(e) => {
            setLoginEmail(e.target.value);
          }}
          value={loginEmail}
          id="email"
          name="email"
          label="Email"
          styles={`w-96`}
          type="email"
          errorMessage="Please use a valid email address"
          validationCondition={() => validators.loginEmail.validationFunction()}
          validationOnSend={!validationErrors.includes("email")}
          setValidationErrors={setValidationErrors}
        />

        <InputField
          onChange={(e) => {
            setLoginPassword(e.target.value);
          }}
          value={loginPassword}
          id="password"
          name="password"
          label="Password"
          type="password"
          styles={`w-96`}
          errorMessage="You need to fill in a password"
          validationCondition={() =>
            validators.loginPassword.validationFunction()
          }
          validationOnSend={!validationErrors.includes("password")}
          setValidationErrors={setValidationErrors}
        />

        <InputError
          message="Email or password are wrong. Please try again"
          showError={unauthorizedError}
        />

        <BodyText size={1} styles="text-charcoal-60 mt-2 font-regular">
          Forgot your password?
        </BodyText>
        <span
          className={`text-sea-80 underline font-regular w-max cursor-pointer`}
        >
          Reset password
        </span>
        <BodyText size={1} styles="text-charcoal-60 mt-2 font-regular">
          Don&apos;t have an account?
        </BodyText>
        <span
          onClick={toggleRegisterDrawer}
          className={`text-sea-80 underline font-regular w-max cursor-pointer`}
        >
          Sign up for Comwell club
        </span>
      </div>
      <span className={`pt-6 mt-2 border-t border-gray-300 px-6 pb-4`}>
        <button
          type="submit"
          className={`text-heading-xsmall-desktop mb-2 py-4 w-full text-center bg-sea-80 text-slate-50 hover:brightness-150 rounded-full font-semibold font-sans tracking-wide`}
        >
          Sign in
        </button>
      </span>
    </form>
  );
}
