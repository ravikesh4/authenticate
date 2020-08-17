import cookies from 'js-cookie';

// set cookies 
export const setCookies = (key, value) => {
    if (window !== 'undefined') {
        cookies.set(key, value, {
            expires: 1
        })
    }
}

// remove cookies 
export const removeCookies = (key) => {
    if (window !== 'undefined') {
        cookies.remove(key, {
            expires: 1
        })
    }
}


// get from cookies such as stored token 
// will be usefull when we need to make request to server with token 
export const getCookie = (key) => {
    if (window !== 'undefined') {
        return cookies.get(key)
    }
}


// set localstorage 
export const setLocalStorage = (key, value) => {
    if(window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

// remove localStorage 
export const removeLocalStorage = (key) => {
    if(window !== 'undefined') {
        localStorage.removeItem(key)
    }
}

// authenticate user by passing bdata to cookies and localStorage during signin 
export const authenticate = (response, next) => {
    console.log('Authenticate helper on signin response', response);
    setCookies('token', response.data.token);
    setLocalStorage('user', response.data.user);
    next();
}




// access user info from localStorage 
export const isAuth = () => {
    if(window !== 'undefined') {
        const cookieChecked = getCookie('token')
        if(cookieChecked) {
            if(localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false;
            }
        }
    }
}

export const signout = (next) => {
    removeCookies('token')
    removeLocalStorage('user')
    next()
};

export const updateUser = (response, next) => {
    console.log('Update user in LS Helpers', response)
    if (typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('user'))
        auth = response.data
        localStorage.setItem('user', JSON.stringify(auth))
    }
    next();
}