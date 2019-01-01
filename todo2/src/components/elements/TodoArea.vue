<template>
  <div :class="styles" >
    <b-form-row>
      <b-col sm="8">{{ areaTitle }}</b-col>
      <b-col sm="2">{{ summary }}</b-col>
      <b-col sm="2"><b-btn @click="toggleView"></b-btn></b-col>
    </b-form-row>
    <ul class="fusens">
      <li v-for="todo in TODOs" :key="todo.id">
        <TodoNoteSticky :todo="todo" @update="onUpdate"/>
      </li>
    </ul>

  </div>
</template>
<script>
import TodoNoteSticky from '../elements/TodoNoteSticky'

function _area(name, color, title) {
  return {
    "name": name,
    "title": title,
    "color": 'bgc-'+color,
    "icon": '<i >'
  }
}
const AREAs = {
  a1:_area('a1','area1','至急重要'),
  a2:_area('a2','area2','急ぎ' ),
  a3:_area('a3','area3','重要' ),
  a4:_area('a4','area4','不急不要' ),
}

export default {
  components:{
    TodoNoteSticky
  },
  props:['type',"todo"],
  computed:{
    styles:function(){
      let s =["wrap",AREAs[this.type].color]
      return s
    },
    TODOs: function(){
      if(!this.todo){
        return []
      }
      return this.todo
    },
    areaTitle:function(){
      console.log(AREAs)
      return AREAs[this.type].title
    },
    summary: function(){
      return '00'
    }
  },
  methods: {
    toggleView: function(){

    },
    onUpdate: function(payload){
      this.$emit("update",payload)
    },
  }
}
</script>

<style>
.wrap {
  width:100%;
  height: auto;
  max-height:100%;
  overflow-x: hidden;
  overflow-y: auto;
}

</style>
