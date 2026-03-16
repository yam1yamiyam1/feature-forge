import { Fragment, useState } from "react";
import "./styles.css";

export const metadata = {
  title: "Multi-Step Onboarding Form",
  difficulty: "D-Rank",
  topics: [
    "useState",
    "Controlled Components",
    "Form Validation",
    "Conditional Rendering",
  ],
};

// POST https://jsonplaceholder.typicode.com/posts
// Body: { title: firstName + ' ' + lastName, body: jobTitle, email, userId: 1 }

// ─── VALIDATION (pure functions, no component logic) ─────
// validateStep1(formData) → { email?, password?, confirmPassword? }
//   - email: required, must contain @
//   - password: required, min 8 chars
//   - confirmPassword: must match password
// validateStep2(formData) → { firstName?, lastName?, jobTitle? }
//   - all three fields required, no empty strings

// ─── STEPINDICATOR ───────────────────────────────────────
// Props: step (1|2|3)
// <div className="mf-steps">
//   step 1:  <div className="mf-step mf-step--done OR mf-step--active">
//   line:    <div className="mf-step-line" />
//   step 2:  <div className="mf-step mf-step--done OR mf-step--active OR (neither)">
//   line:    <div className="mf-step-line" />
//   step 3:  <div className="mf-step mf-step--active OR (neither)">
//   rule: step < current → done, step === current → active, step > current → neither
// </div>

export const StepIndicator = ({ step }) => {
  const steps = [1, 2, 3];
  return (
    <div className="mf-steps">
      {steps.map((s, index) => (
        <Fragment key={index}>
          <div
            className={
              s < step
                ? "mf-step--done"
                : s === step
                  ? "mf-step--active"
                  : "mf-step-line"
            }
          >
            Step {s}
          </div>
          <div className="mf-step-line" />
        </Fragment>
      ))}
    </div>
  );
};

// ─── ACCOUNTSTEP ─────────────────────────────────────────
// Props: formData, errors, onChange, onNext
// Wrap everything in <form onSubmit={e => { e.preventDefault(); onNext() }}>
// Fields: email (type="email"), password (type="password"), confirmPassword (type="password")
// <form>
//   <div className="mf-fields">
//     <div className="mf-field">
//       <label className="mf-label">Email</label>
//       <input className="mf-input" OR "mf-input mf-input--error" />
//       { errors.email && <span className="mf-error">{errors.email}</span> }
//     </div>
//     ... same for password, confirmPassword
//   </div>
// </form>
const AccountStep = ({ formData, errors, onChange, onNext }) => {
  const fields = ["email", "password", "confirmPassword"];
  const handleInput = (e) => {
    const { value, name } = e.target;
    onChange(name, value);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="mf-fields">
        {/* email field */}
        {fields.map((fName) => {
          const label =
            fName === "confirmPassword"
              ? "Confirm Password"
              : fName[0].toUpperCase() + fName.slice(1);
          const type = fName === "email" ? "email" : "password";
          return (
            <div key={fName} className="mf-field">
              <label htmlFor={fName} className="mf-label">
                {label}
              </label>
              <input
                className={
                  errors[fName] ? "mf-input mf-input--error" : "mf-input"
                }
                type={type}
                id={fName}
                name={fName}
                value={formData[fName]}
                onChange={handleInput}
                placeholder={label}
              />
              {errors[fName] && (
                <span className="mf-error">{errors[fName]}</span>
              )}
            </div>
          );
        })}
      </div>
      <button type="submit" />
    </form>
  );
};

// ─── PROFILESTEP ─────────────────────────────────────────
// Props: formData, errors, onChange, onNext
// Same <form onSubmit> pattern as AccountStep
// Fields: firstName (type="text"), lastName (type="text"), jobTitle (type="text")

// ─── CONFIRMSTEP ─────────────────────────────────────────
// Props: formData ONLY — no onChange, no inputs, no form
// Display all 5 filled fields (hide password value, show "••••••••")
// <div className="mf-confirm">
//   <div className="mf-confirm-row">
//     <span className="mf-confirm-label">Email</span>
//     <span className="mf-confirm-value">{formData.email}</span>
//   </div>
//   ... × 5 rows: email, password(masked), firstName, lastName, jobTitle
// </div>

// ─── ONBOARDINGFORM (root) ───────────────────────────────
// State: step (1), formData (all fields empty string), errors ({}), isSubmitting (false), submitted (false)
// formData shape: { email, password, confirmPassword, firstName, lastName, jobTitle }
//
// handleChange(field, value) → setFormData spreading prev
// handleNext() → run validateStep(formData), if errors object is empty advance step, else setErrors
// handleBack() → step - 1, clear errors
// handleSubmit() → setIsSubmitting true, POST, on success setSubmitted true
//
// <div className="mf-wrap">
//   <StepIndicator step={step} />
//   <div className="mf-body">
//     { step === 1 && <AccountStep formData errors onChange={handleChange} onNext={handleNext} /> }
//     { step === 2 && <ProfileStep formData errors onChange={handleChange} onNext={handleNext} /> }
//     { step === 3 && <ConfirmStep formData /> }
//   </div>
//   <div className="mf-footer">
//     { step > 1 && <button className="mf-btn-back" onClick={handleBack}>Back</button> }
//     { step < 3
//         ? <button className="mf-btn-next" onClick={handleNext}>Next</button>
//         : <button className="mf-btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : 'Submit'}
//           </button> }
//   </div>
// </div>
//
// submitted === true → skip everything above, render:
// <div className="mf-wrap">
//   <div className="mf-success">Account created successfully.</div>
// </div>

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNext = () => {
    setStep((prev) => prev + 1);
  };
  return (
    <div className="mf-wrap">
      <StepIndicator step={step} />
      <AccountStep
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onNext={handleNext}
      />
    </div>
  );
}
