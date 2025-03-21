const storeToken = (value) => {
    if (value) {
        console.log("Store Token")
        const { access, refresh } = value
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
    }
}

const getToken = () => {
    const access_token = localStorage.getItem("access_token");
    return access_token ? { access_token } : { access_token: null };
  };

const removeToken = () => {
    console.log("Removing Token");
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}


export { storeToken, getToken, removeToken }