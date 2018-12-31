<template>
    <div class="todo-view">
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
.todo-view{
    position: relative;
    
}
</style>
