import { createStore } from 'vuex';

import coachesModule from './modules/coaches/index.js';
import requestsModule from './modules/requests/index.js';
const store = createStore({

    modules: { 
        coaches: coachesModule,
        requests: requestsModule
    },
    state(){
        return {
            coachId: 'c3',
        }
    },
    getters:{
        coachId(state){
            return state.coachId;
        }
    }
});


export default store;