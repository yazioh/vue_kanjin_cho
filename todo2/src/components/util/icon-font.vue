<template>
    <i :class="iconName" :title="title"/>
    <!-- <font-awesome-icon icon="user-secret" />
    <i class="fab fa-coffee-icon"/> -->
</template>
<script>
export default {
    props:{
        'name': { default: 'dizzy'}, 
        'type':{ default: 'fas'} ,
        'title': { }
    },
    computed: {
        iconName:function(){
            return [
                this.type || 'fas',
                'fa-' + this.name || 'fa-dizzy'
            ]
        }
    }
}
</script>
