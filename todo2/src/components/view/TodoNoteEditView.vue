<template>
  <div>
    <b-modal ref="modal" size="lg" 
      :ok-only="true"
      ok-title="保存" ok-variant="light" ok-size="sm"
      @ok="saveTodo"
      :header-class="nowAreaColor"      
      :body-class="nowAreaColor"      
      :footer-class="nowAreaColor"      
    >
        <div slot="modal-header" style="width:100%" 
         >
          <b-form-row >
            <b-col sm="1">
              <b-btn id="areaSelect" 
                variant="light"
                @click="pop1Show" 
              >
                <iconFont :name="nowAreaIcon" />
             </b-btn>
            </b-col>
            <b-col sm="7">
              <b-input placeHolder="サマリ・概要" />
            </b-col>
            <b-col sm="3">
              

            </b-col>
            <b-col sm="1" class="text-right">
              <b-btn size="sm" variant="light" 
                 @click="hide" >
                <iconFont name="times" />
             </b-btn>
            </b-col>
          </b-form-row>
        </div>

        <b-form-row>
          <b-col sm="8"><!-- 左側 -->
            <ul id="doingTask">
              <li v-for="task in doingTasks">
                <b-chackbox val></b-chackbox>
                <b-form-row>
                  <b-col cols="11">
                    <b-form-checkbox 
                      v-model="task.status" 
                        value="v"
                        unchecked-value="_"
                        @change="onUpdate(task.id)"
                      >
                        {{ task.label }}
                      </b-form-checkbox>
                  </b-col>
                  <b-col cols="1">

                  </b-col>
                </b-form-row>
              </li>
            </ul>

            <ul id="doneTask">
              <li>
                <b-form-row>
                </b-form-row>
              </li>
            </ul>
          </b-col>
          <b-col> <!-- 右側 -->
            <h5>schedule</h5>
            <ul id="asignWeek">
              <li v-for="(week,i) in weeks" :key="i" class="mb10">
                <b-form-row>
                  <b-col sm="4">
                    <b-btn size="sm" variant="light" style="width:100%">
                      {{ week.label }}
                    </b-btn>
                  </b-col>
                  <b-col sm="3">{{ fuzzyTime(week.task) }}</b-col>
                  <b-col sm="5">
                    <b-progress 
                      :value="week.done" 
                      :max="2400"
                      
                      style="margin-to:0.5rem"
                    >
                       <b-progress-bar variant="success" :value="week.done" />
                       <b-progress-bar :variant="taskVariant(week)" :striped="true" :value="week.task - week.done" />
                    </b-progress>
                  </b-col>
                </b-form-row>
                <div style="padding-top:0.25rem;">
                  <b-btn size="sm">1</b-btn>
                  <b-btn size="sm">1</b-btn>
                  <b-btn size="sm">1</b-btn>
                  <b-btn size="sm">1</b-btn>
                  <b-btn size="sm">1</b-btn>
                  <b-btn size="sm">1</b-btn>
                  <b-btn size="sm">1</b-btn>
                </div>
              </li>
            </ul>

          </b-col>
        </b-form-row>


    </b-modal>

      <b-popover show target="areaSelect" title="優先順位">
        <b-btn v-for="area in areas" :key="area.name" 
          style="width:6em; text-align:center"
          :class="area.color"
          variant="light"
          ><iconFont :name="area.icon" @click="changeArea(area)"/>
            <br />{{ area.title }}
          </b-btn>
      </b-popover>
  </div>
</template>
<script>
//------------------------------------------
import Areas from '../mixin/Areas'
const WEEK_MAX = 5 * 8 * 60 // min 
export default {
  mixins:[Areas],
  props:{
    doingTasks:function(){
      return [
        {id:"001",label:'aaaaaaaa', status:'_'},
        {id:"002",label:'aaaa', status:'_'},
        {id:"003",label:'aaaa', status:'_'},
        {id:"004",label:'bbbbbbbbb', status:'_'},
        {id:"005",label:'vvvvvvvvv', status:'_'},
      ]
    },
    doneTasks:function(){
      return [
        {id:"101",label:'aaaaaaaa', status:'v'},
        {id:"102",label:'aaaa', status:'v'},
      ]
    }
  },
  computed:{
    nowAreaColor:function(){
      return this.areaColor(this.edit.area)
    },
    nowAreaIcon:function(){
      console.log(this.edit.area)
      return this.areaIconName(this.edit.area)
    },
  },
  data:function(){
    return {
      edit:{
        area : 'a1',
        title: '',
      },
      weeks:[
        {label: '今週',   start:'2019/01/01', task:1600, done:840 },
        {label: '来週',   start:'2019/01/01', task:360, done:20 },
        {label: '1月3週', start:'2019/01/01', task:520, done:0 },
        {label: '1月4週', start:'2019/01/01', task:1000, done:55 },
        {label: '2月1週', start:'2019/01/01', task:2500, done:0 }
      ]
    }
  },
  methods:{
    show:function(){
      this.$refs.modal.show()
    },
    hide: function(){

    },
    fuzzyTime: function(t){
      switch(true){
        case t<60 :
          return (t*1).toFixed(0) + ' m'
        case t< 400 :
          return (t/60).toFixed(1) + ' h'
      }
      return (t/480).toFixed(1) + ' d'
    },
    pop1Show:function(){
      this.$refs.pop1.$emit('open')
    },
    changeArea:function(area){
      this.area = area.name // a1 .. a4
    },
    saveTodo: function(){
      this.$emit("update",{
        from:"edit",
        payload: this.edit
      })
    },
    taskVariant: function(week){
      return (week.task >= WEEK_MAX )? 'danger' : 'info'
    },
  }
}
</script>
