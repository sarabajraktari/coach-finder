export default {
    namespaced:true,

    state(){
        return{
            requests: []
        }
    },
    mutations:{
        addRequest(state, payload){
            state.requests.push(payload);
        },
        setRequests(state, payload){
            state.requests = payload;
        }
    },
    actions:{
        async contactCoach(context, payload){
            const newRequest = {
                userEmail: payload.email,
                message: payload.message
            };
            const response = await fetch(`https://coach-finder-eeaea-default-rtdb.firebaseio.com/requests/${payload.id}.json`,{
                method: 'POST',
                body: JSON.stringify(newRequest)
            });
            const responseData = await response.json();
            if(!response.ok){
                const error = new Error(responseData.message || 'Failed to send request.');
                throw error;
            }
            newRequest.id = responseData.name;
            newRequest.coachId = payload.id;
            context.commit('addRequest', newRequest);
        },
        async fetchRequests(context){
            const coachId = context.rootGetters.userId;
            console.log(coachId);
            const response = await fetch(`https://coach-finder-eeaea-default-rtdb.firebaseio.com/requests/${coachId}.json`);
            const responseData = await response.json();

            if(!response.ok){
                const error = new Error(responseData.message || 'Failed to fetch requests');
                throw error;
            }

            const requests = [];

            for(const key in responseData){
                const request = {
                    id: key,
                    coachId: coachId,
                    userEmail: responseData[key].userEmail,
                    message: responseData[key].message
                };

                requests.push(request);
            }

            context.commit('setRequests', requests);
        }
    },
    getters:{
        requests(state, _, _2, rootGetters){
            const coachId = rootGetters.coachId;
            return state.requests.filter(req => req.coachId === coachId);
        },
        hasRequests(_, getters){
            return getters.requests && getters.requests.length > 0;
        }
    }
}