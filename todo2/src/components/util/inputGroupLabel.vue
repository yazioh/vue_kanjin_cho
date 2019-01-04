<template>
  <div :class="myStyle">
    <span class="input-group-text"><slot /></span>
  </div>        
</template>
<script>

export default {
  props:['type'],
  computed:{
    myStyle:function(){
      switch(this.type){
        case 'prepend': 
          return 'input-group-prepend';
        case 'append': 
        default:
          return 'input-group-append';
      } 
    }
  }
}
</script>

