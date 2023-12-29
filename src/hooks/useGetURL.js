export const useGetURL = () => {
    const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

    return [CLIENT_URL, SERVER_URL];
};
