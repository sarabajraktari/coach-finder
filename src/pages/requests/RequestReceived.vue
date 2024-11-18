<template>
    <div>
        <base-dialog :show="!!error" title="An error occured!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <header>
                    <h2>Requests Received</h2>
                </header>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <ul v-else-if="hasRequests && !isLoading">
                    <request-item v-for="req in requests"
                                :key="req.id"
                                :email="req.userEmail"
                                :message="req.message">
                    </request-item>
                </ul>
                <h3 v-else>You haven't received any requests yet!</h3>
            </base-card>
        </section>
    </div>
</template>
<script>
    import RequestItem from '../../components/requests/RequestItem.vue';
    export default{
        components:{ RequestItem },
        data(){
            return{
                error:null,
                isLoading: true,
            }
        },
        computed:{
            requests(){
                return this.$store.getters['requests/requests'];
            },
            hasRequests(){
            return this.$store.getters['requests/hasRequests'];
            }
        },
        methods:{
            async fetchRequests(){
                this.isLoading = true;
                try{
                    await this.$store.dispatch('requests/fetchRequests');
                } catch(error){
                    this.error = error.message || 'Something failed!'
                }
                this.isLoading = false;
            },
            handleError(){
                this.error = null;
            }
        },
        created(){
            this.fetchRequests();
        }
    
    }
</script>

<style scoped>
    header {
    text-align: center;
    }

    ul {
    list-style: none;
    margin: 2rem auto;
    padding: 0;
    max-width: 30rem;
    }

    h3 {
    text-align: center;
    }
</style>