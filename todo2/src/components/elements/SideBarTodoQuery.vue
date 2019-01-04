<template>
  <div>
    <b-modal 
      ref="modal"
      size="lg"
      title="検索条件"
      :ok-only="true"
      ok-title="更新"

      @ok="onUpdateQuery"
    >
      <b-form-row>
        <b-col md="4">
          
          <b-input-group >
            <inputGroupLabel type="prepend"><iconFont name="search"/></inputGroupLabel>
            <b-input v-model="conditions.freeWord" />
          </b-input-group>

        </b-col>
        <b-col md="4">

          <b-form-group label="進行">
            <b-form-checkbox-group stacked 
              v-model="conditions.TodoaStatus" 
              name="TodoaStatus" 
              :options="optTodoGrop">
            </b-form-checkbox-group>
          </b-form-group>

        </b-col>
        <b-col md="4">

          <b-form-group label="作業予定">
            <b-form-radio-group stacked 
              v-model="conditions.Scheduled" 
              name="Scheduled" 
              :options="optScheduleGrop">
            </b-form-radio-group>
          </b-form-group>          
        </b-col>
      </b-form-row>
    
    {{ conditions }}
    </b-modal>
  </div>
</template>
<script>

export default {
  props:{
    currentCond:{}
  },
  computed:{
    optTodoGrop:function(){
      return [
        {text: '未着手', value: 'y'},
        {text: '進行中', value: 'd'},
        {text: '完了', value: 'v'},
      ]
    },
    optScheduleGrop:function(){
      return [
        {text: '本日', value: 'td'},
        {text: '昨日', value: 'fd'},
        {text: '明日', value: 'nd'},
        {text: '今週', value: 'tw'},
        {text: '来週', value: 'fw'},
        {text: '先週', value: 'nw'},
      ]
    },

  },
  data: function(){
    return{
      conditions:{
        freeWord:'',
        TodoaStatus:[],
        Tags:[],
        TaskStatus:[],
        Scheduled:'',
        TaskAre:[]
      }
    }
  },
  methods:{

    show: function(){
      this.$refs.modal.show()
      this.$emit("show",{"from":'TodoQueryTab'})
    },
    hide:function(){
      this.$refs.modal.hide()
      this.$emit("hide",{"from":'TodoQueryTab'})
    },
    onUpdateQuery:function(){
      this.$emit("update",{
          "from":'TodoQueryTab',
          "payloda":{
            condition: this.conditions
          }})
      this.hide()
    }
  },
  created:function(){
    // currentCond -> conditions のコピー起動する
  }
}
</script>


