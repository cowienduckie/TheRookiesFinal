export const requiredValidate = (value, msg = "This field is required!") => {
  if (value === "" || value === undefined || value === null) {
    return msg;
  }
  return "";
};

export const minLengthValidate = (value, length, msg) => {
  if (value.length < length) {
    return msg || `This field has at least ${length} character(s)`;
  }
  return "";
};

export const patternValidate = (value, regex, msg) => {
  if (!regex.test(value)) {
    return msg;
  }
  return "";
};

export function CheckNullValidation(errorMsg, fieldName) {
  return ({ getFieldValue }) => ({
    validator() {
      if (getFieldValue(fieldName) !== "") {
        return Promise.resolve();
      }
      return Promise.reject(new Error(errorMsg));
    }
  });
}

