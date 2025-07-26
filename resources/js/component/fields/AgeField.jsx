import { useState } from "react";

function AgeField({ formData, handleChange, onValidate }) {
  const [ageValid, setAgeValid] = useState(true); 
  const [ageMessage, setAgeMessage] = useState("");
  const [birthday, setBirthday] = useState(formData.birthday || "");
  const [age, setAge] = useState(formData.age || "");

  const validateAge = (age) => {
    if (age < 18) {
      setAgeValid(false);
      setAgeMessage("⚠️ You must be at least 18 years old.");
      onValidate(false);
    } else {
      setAgeValid(true);
      setAgeMessage("");
      onValidate(true);
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return;
  
    const birthDate = new Date(birthday);
    const currentDate = new Date();
    let calculatedAge = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      calculatedAge -= 1;
    }
  
    setAge(calculatedAge);
    setBirthday(birthday);
    validateAge(calculatedAge);

    handleChange({ target: { name: "age", value: calculatedAge } });
  };
  

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Birthday</label>
        <input
          type="date"
          name="birthday"
          className="form-control"
          value={birthday}
          onChange={(e) => {
            calculateAge(e.target.value);
            handleChange(e);
          }}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Age</label>
        <input
          type="number"
          name="age"
          className={`form-control ${!ageValid ? "is-invalid" : ""}`}
          value={age}
          disabled
          readOnly
        />
        {!ageValid && (
          <div className="invalid-feedback">
            {ageMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgeField;
