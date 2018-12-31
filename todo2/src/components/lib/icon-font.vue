<template>
    <i :class="iconName"/>
    <!-- <font-awesome-icon icon="user-secret" />
    <i class="fab fa-accessible-icon"/> -->
</template>
<script>
export default {
    props:['name','type'],
    computed: {
        iconName:function(){
            return "fab fa-accessible-icon"
        }
    }
}
</script>
