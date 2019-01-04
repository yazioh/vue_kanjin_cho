<template>
    <div class="container-fluid todo-view">
        <slot  v-if="show" />
    </div>
</template>
<script>
export default {
    props:{
        lotate:{},
        show:{
            default: false
        }
    }
}
</script>

<style scoped>
.todo-view {
    margin: 0;
    position: relative;
    width:100%; 
    height:calc(100% - 10px);
}
</style>
