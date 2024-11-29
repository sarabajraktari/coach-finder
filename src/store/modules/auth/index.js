let timer;
export default {
    state(){
        return {
            userId: Date.now() + Math.floor(Math.random() * 1000),
            token: null,
            didAutoLogout: false,
        }
    },
    mutations: {
        setUser(state, payload) {
            state.token = payload.token;
            state.userId = payload.userId;
            state.didAutoLogout = false;
        },
        setAutoLogout(state){
            state.didAutoLogout = true;
        }
    },
    actions: {
        async login(context, payload){
            return context.dispatch('auth', {
                ...payload,
                mode: 'login'
            })
        },
        async signup(context, payload){
           return context.dispatch('auth',{
                ...payload,
                mode:'signup'
            })
        },
       async auth(context, payload){
            let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAksozxqk_pnBX-eVWgNYiERZZiBvAfmoE';
            const mode = payload.mode;

            if(mode === 'signup'){
                url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAksozxqk_pnBX-eVWgNYiERZZiBvAfmoE';
            }
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })
            });
            const responseData = await response.json();

            if(!response.ok){
                const error = new Error(response.message || 'Failed to login. Check your login data');
                throw error;
            }
            const expiresIn = +responseData.expiresIn * 1000;
            const expirationDate = new Date().getTime() + expiresIn;

            // if you want autologin when refresh the app, you need to store these data on localstorage
            localStorage.setItem('token', responseData.idToken);
            localStorage.setItem('userId', responseData.localId);
            localStorage.setItem('tokenExpiration', expirationDate);

           timer= setTimeout(function(){
                context.dispatch('autoLogout');
            }, expiresIn)

            context.commit('setUser', {
                token: responseData.idToken,
                userId: responseData.localId,
            });
        },
        tryLogin(context){
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const tokenExpiration = localStorage.getItem('tokenExpiration');

            const expiresIn = +tokenExpiration - new Date().getTime();

            if(expiresIn < 0){
                return;
            }
            
            setTimeout(function(){
                context.dispatch('autoLogout');

            },expiresIn)

            if(token && userId){
                context.commit('setUser', {
                    token: token,
                    userId: userId,
                });
            }
        },
        logout(context){
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('tokenExpiration');

            clearTimeout(timer);

            context.commit('setUser',{
                token: null,
                userId: null,
            });
        },
        autoLogout(context){
            context.dispatch('logout');
            context.commit('setAutoLogout')
        }
    },
    getters: {
        isAuthenticated(state){
            return state.token;
        },
        userId(state) {
            return state.userId;
        },
        token(state){
            return !!state.token; //added double ! to make it boolean type
        },
        didAutoLogout(state){
            return state.didAutoLogout;
        }
    }
}