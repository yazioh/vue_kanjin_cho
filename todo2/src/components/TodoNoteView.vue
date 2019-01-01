<template>
    <div class="container-fluid todo-view">
        <slot  v-if="show" />
    </div>
</template>
<script>
export default {
    props:{
        show:{
            default: false
        }
    }
}
</script>

<style scoped>
.todo-view {
    position: relative;
    width:100%; height:100%;
    
}
</style>
