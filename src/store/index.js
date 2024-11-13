import { createStore } from 'vuex';

import coachesModule from './modules/coaches/index.js';

const store = createStore({

    modules: { 
        coaches: coachesModule
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