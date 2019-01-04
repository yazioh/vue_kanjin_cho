<template>
  <div :class="styles" >
    <b-form-row class="header">
      <b-col sm="9"><iconFont :name="areaIcon"/> {{ areaTitle }}</b-col>
      <b-col sm="3">
          <b-btn 
            size="sm"
            variant="light" 
            class="float-right"
            @click="toggleView"
          >
              <iconFont :name="sumModeIcon"/>
          </b-btn>
          {{ summary }}
      </b-col>
    </b-form-row>

    <ul class="fusens mt10">
      <li v-for="todo in TODOs" :key="todo.id">
        <TodoNoteSticky :todo="todo" @update="onUpdate"/>
      </li>
    </ul>

  </div>
</template>
<script>
import TodoNoteSticky from '../elements/TodoNoteSticky'
import Areas from '../mixin/Areas'

const SUM_MODE = [
  { type:'sticky', 'icon':'sticky-note', type:'fas' },
  { type:'tasks', 'icon':'list' , type:'fas' },
  { type:'yet', 'icon':'square' , type:'far' },
  { type:'checked', 'icon':'check-square' , type:'far' },
]

export default {
  mixins:[Areas],
  components:{
    TodoNoteSticky
  },
  props:['type',"todo"],
  computed:{
    areaIcon: function(){
      return this.areaIconName(this.type)
    },
    sumModeIcon: function(){
      return SUM_MODE[this.sumMode].icon
    },
    styles:function(){
      let s =[
        'wrap',
        'innertWrap',
        'rounded',
        this.areaColor(this.type)
      ]
      return s
    },
    TODOs: function(){
      if(!this.todo){
        return []
      }
      return this.todo
    },
    areaTitle:function(){
      return this.areaLabel(this.type)
    },
    summary: function(){
      return '00'
    }
  },
  data: function(){
    return {
      sumMode: 0
    }
  },
  methods: {
    toggleView: function(){
      this.sumMode = (++this.sumMode)%(SUM_MODE.length) 
    },
    onUpdate: function(payload){
      this.$emit("update",payload)
    },
  }
}
</script>

<style scoped>
.wrap {
  width:100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.header {
  line-height:2
}
</style>
