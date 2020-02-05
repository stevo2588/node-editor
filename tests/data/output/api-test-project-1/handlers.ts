
export const handleGetUsersPuserId = (handler: (e, c) => User) => ((event, context) => {
  return handler(event, context);
});
