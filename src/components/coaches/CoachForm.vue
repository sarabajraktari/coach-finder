<template>
    <form @submit.prevent="submitForm">
        <div class="form-control">
            <label for="firstname">FirstName</label>
            <input type="text" name="firstname" id="firstname" v-model.trim="firstName">
        </div>
        <div class="form-control">
            <label for="lastname">Lastname</label>
            <input type="text" name="lastname" id="lastname" v-model.trim="lastName">
        </div>
        <div class="form-control">
            <label for="description">Description</label>
            <textarea id="description" rows="5" v-model="description">
        </div>
        <div class="form-control">
            <label for="rate">Hourly Rate</label>
            <input type="number" name="rate" id="rate" v-model.number="rate">
        </div>
        <div class="form-control">
            <h3>Areas of Expertise</h3>
            <div>
                <input type="checkbox" name="frontend" id="frontend" value="frontend" v-model="areas">
                <label for="frontend">Frontend Development</label>
            </div>
               <div>
                <input type="checkbox" name="backend" id="backend" value="backend" v-model="areas">
                <label for="backend">Backend Development</label>
            </div>
               <div>
                <input type="checkbox" name="career" id="career" value="career" v-model="areas">
                <label for="career">Career Advisory</label>
            </div>
        </div>
        <base-button></base-button>
    </form>
</template>
<script>
export default {
    data(){
        return {
            firstName: '',
            lastName: '',
            description: '',
            rate: null,
            areas:[]
        }
    },
    methods:{
        submitForm(){
           const formData = {
                first: this.firstName,
                last: this.lastName,
                desc: this.description,
                rate: this.rate,
                areas: this.areas
            };
            console.log(formData);
        }
    }
}
</script>
<style scoped>

</style>