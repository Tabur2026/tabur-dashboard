export const msalConfig = {
  auth: {
    clientId: "30f3ceed-213b-4eab-94b5-8e210cc42bee",
    authority:
      "https://login.microsoftonline.com/ab79833e-417a-460e-9da3-37a526b866f1",
   redirectUri: window.location.origin,
  },
};

export const loginRequest = {
  scopes: [
    "User.Read",
    "https://analysis.windows.net/powerbi/api/Report.Read.All",
  ],
};
