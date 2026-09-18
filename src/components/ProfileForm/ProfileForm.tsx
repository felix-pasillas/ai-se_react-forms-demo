import { useEffect, useState } from "react";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { getProfile, saveProfile } from "../../utils/api";
import "./ProfileForm.css";

export default function ProfileForm() {
  const { values, handleChange, errors, isValid, setValues } =
    useFormWithValidation({
      name: "",
      email: "",
    });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const profile = await getProfile();
      setValues(profile);
      setIsLoadingProfile(false);
    }
    loadProfile();
  }, [setValues]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await saveProfile(values);
      setSubmitSuccess(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h1 className="profile-form__title">Your Profile</h1>

      {isLoadingProfile ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="profile-form__field">
            <label className="profile-form__label" htmlFor="name">
              Name
            </label>
            <input
              className="profile-form__input"
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              minLength={2}
              maxLength={40}
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="profile-form__error">{errors.name}</span>
            )}
          </div>

          <div className="profile-form__field">
            <label className="profile-form__label" htmlFor="email">
              Email
            </label>
            <input
              className="profile-form__input"
              id="email"
              name="email"
              type="email"
              placeholder="johndoe@example.com"
              required
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="profile-form__error">{errors.email}</span>
            )}
          </div>

          <button
            className="profile-form__save-btn"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save"}
          </button>
          {submitError && (
            <span className="profile-form__error">{submitError}</span>
          )}
          {submitSuccess && <span>Submission successful</span>}
        </>
      )}
    </form>
  );
}
