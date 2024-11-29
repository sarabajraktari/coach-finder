export default {
    
    state(){
        return {
            userId: Date.now() + Math.floor(Math.random() * 1000),
            token: null,
            tokenExpiration: null,
        }
    },
    mutations: {
        setUser(state, payload) {
            state.token = payload.token;
            state.userId = payload.userId;
            state.tokenExpiration = payload.tokenExpiration;
        }
    },
    actions: {
        async login(context, payload){
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAksozxqk_pnBX-eVWgNYiERZZiBvAfmoE', {
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

            console.log(responseData);
            context.commit('setUser', {
                token: responseData.idToken,
                userId: responseData.localId,
                tokenExpiration: responseData.expiresIn
            });
        },
        async signup(context, payload){
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAksozxqk_pnBX-eVWgNYiERZZiBvAfmoE',{
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true
                })
            });

            const responseData = await response.json();

            if(!response.ok){
                const error = new Error(response.message || 'Failed to authenticate. Check your login data.');
                throw error;
            }

            console.log(responseData);
            context.commit('setUser', {
                token: responseData.idToken,
                userId: responseData.localId,
                tokenExpiration: responseData.expiresIn
            });
        },
        logout(context){
            context.commit('setUser',{
                token: null,
                userId: null,
                tokenExpiration: null, 
            });
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
        }
    }
}