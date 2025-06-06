export const isCorrectFormat = (
  type: "email" | "password",
  input: string
): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

  if (type === "email") {
    return emailRegex.test(input);
  } else {
    return passwordRegex.test(input);
  }
};
