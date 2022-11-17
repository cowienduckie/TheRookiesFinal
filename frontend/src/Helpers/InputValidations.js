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
