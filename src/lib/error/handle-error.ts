export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error);
    return error.message;
  }
  return error as string;
};
