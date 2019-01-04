<template>
  <div class="sticky">
    <div>
      <p class="title">{{ title }}</p>
      <ul v-if="modePreview" class="todos">

        <li v-for="task in TASKs" :key="task.id">
          <b-form-checkbox 
            v-model="task.status" 
              value="v"
              unchecked-value="_"
            @change="onUpdate(task.id)"
            >{{ task.label }} {{ task.id }}</b-form-checkbox>
        </li>
      </ul>    
    </div>
  </div>
</template>
<script>

// 定数はどこにもってけば？
const MODE_CHECK = 1;
const MODE_PREVIEW = 2;


export default {
  props:{
    todo:{},
  },
  computed:{

    TASKs: function(){
      if(!this.todo || !this.todo.tasks){
        return []
      }
      return this.todo.tasks
    },
    title: function(){
      if(!this.todo ){
        return 'nodata'
      }
      return this.todo.title
    },
    modePreview: function(){
      return true
    },
    modeCheck: function(){
      return true
    }
    
  },
  data: function(){
    return {
      name: "TodoNoteSticky",

    }
  },
  methods:{
    onUpdate: function(taskID){
      this.$emit("update", {
        from: this.name,
        taskID: taskID
      })
    }
  },
  created:function(){

  },
  watch:{
    todo: function(){
      this.$forceupdate()
    }
  }
}
</script>
<style>

  .sticky {
    background-color: rgba(255,255,255,0.5);
    box-shadow:1px 1px 0 rgba(0,0,0,0.25); 
    margin:0 0.25rem 0.5rem;
  }
  .sticky > div {
    padding: 0.5rem;
  }

</style>
