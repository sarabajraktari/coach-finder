export default{
    namespaced:true,
    state(){
        return {
            coaches:[
                {
                  id: 'c1',
                  firstName: 'Maximilian',
                  lastName: 'Schwarzmüller',
                  areas: ['frontend', 'backend', 'career'],
                  description:
                    "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
                  hourlyRate: 30
                },
                {
                  id: 'c2',
                  firstName: 'Julie',
                  lastName: 'Jones',
                  areas: ['frontend', 'career'],
                  description:
                    'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
                  hourlyRate: 30
                }
            ]
        }
    },
    mutations:{
      registerCoach(state, payload){
        state.coaches.push(payload);
      },
      setCoaches(state, payload){
        state.coaches = payload;
      }
    },
    actions:{
      // Register Coach
      async registerCoach(context, data){
        const coachId = context.rootGetters.coachId 
        const coachData= {
          firstName: data.first,
          lastName: data.last,
          description: data.desc,
          hourlyRate: data.rate,
          areas: data.areas
        };

        const response = await fetch(
          `https://coach-finder-eeaea-default-rtdb.firebaseio.com/coaches/${coachId}.json`,
          {
            method: 'PUT',
            body: JSON.stringify(coachData)
          }
        );


        if(!response.ok){
          // error ...
          console.error("Failed to register coach");
          throw new Error('Failed to register coach');
        }
        context.commit('registerCoach', {
          ...coachData,
          id: coachId
        });
      },

      // Fetch coaches
      async loadCoaches(context){
        const response = await fetch(
          'https://coach-finder-eeaea-default-rtdb.firebaseio.com/coaches.json'
        );
        
        const responseData = await response.json();

        if(!response.ok){
            const error = new Error(responseData.message || 'Failed to fetch');
            throw error;
        }

        const coaches =[];
        for(const key in responseData){
          const coach ={
            id: key,
            firstName: responseData[key].firstName,
            lastName: responseData[key].lastName,
            description: responseData[key].description,
            hourlyRate: responseData[key].hourlyRate,
            areas: responseData[key].areas
          }
          coaches.push(coach);
        }
        context.commit('setCoaches', coaches);
      }
    },
    getters:{
        isCoach(_, getters, _2, rootGetters){
          const coaches = getters.coaches;
          const userId = rootGetters.coachId;
          return coaches.some(coach => coach.id == userId);
        },
        coaches(state){
            return state.coaches;
        },
        hasCoaches(state){
            return state.coaches && state.coaches.length > 0;
        }
    },
}