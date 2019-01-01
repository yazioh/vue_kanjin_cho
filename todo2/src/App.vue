<template>
  <div id="app" :class="myClass">
    <!-- メインエリア（排他選択する） -->
    <TodoNoteView :show="true" @show="viewActive">
      <TodoNoteMainView :TODOs="TODOs" @update="onUpdate" />
    </TodoNoteView>

    <!-- クエリーコントロール -->
    <TodoNoteSideBar :show="true" ></TodoNoteSideBar>
    <TodoNoteFooter></TodoNoteFooter>
</div>
</template>
<script>

// vue controller
import TodoNoteView from './components/TodoNoteView'
import TodoNoteViewSelector from './components/mixin/TodoNoteViewSelector'
// Views
import TodoNoteMainView from './components/view/TodoNoteMainView'
import TodoNoteSideBar from './components/view/TodoNoteSideBar'
import TodoNoteFooter from './components/view/TodoNoteFooter'
// DATA
import TODO from './components/classes/TODO.js'
import TASK from './components/classes/TASK.js'

// 現在どのモードで表示しているか判定 
// これは手動判定の必要がある
const BootStrapBreakPoint = {
  'xl':1200,
  'lg':992,
  'md':768,
  'sm':576,
  'xs':0,
}
// タブバーの表示サイズ
const UI_BAR_HEIGHT = 80;
const UI_BAR_WIDTH_S = 60;
const UI_BAR_WIDTH_L = 120;


export default {
  name: 'App',
  mixins:[TodoNoteViewSelector],
  components: {
    TodoNoteView,
    TodoNoteSideBar,
    TodoNoteFooter,
    TodoNoteMainView,
  },
  props:{
  },
  computed:{
    myClass: function(){
      return [
        'screen-'+this.size,
        'screen-'+this.lotate,
      ]
    }
  },
  data:function(){
    return {
      size: '',
      lotate: '',
      windowWidth: '',
      windowHeight: '',
      TODOs : {},
      TASKs : {},
      TAGs : {}
    }
  },
  methods:{
    onUpdate: function( payload ){

      // 
      this.$forceUpdate()
    },
    onWindowResize: function(){
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.size = Object.keys(BootStrapBreakPoint).find((ix) => {
        return (this.windowWidth >= BootStrapBreakPoint[ix] )
      })
      this.lotate = ((this.windowWidth - UI_BAR_WIDTH_S) > (this.windowHeight-UI_BAR_HEIGHT))? "landscape": "portrait"
    }
  },
  created:function(){
    console.log(new TODO({}))
    this.TASKs = [
      _task("なんかかか","v", 1),
      _task("なんかかか","_", 1),
      _task("なんかかか","_", 1),
      _task("なんかかか","_", 2),
      _task("なんかかか","_", 3),
      _task("なんかかか","_", 4),
      _task("なんかかか","_", 5),
      _task("なんかかか","_", 6),
    ]

    this.TODOs = [
      _todo("hoge",'a1', this.TASKs),
      _todo("hoge2",'a1', this.TASKs),
      _todo("hoge3",'a1', this.TASKs),
      _todo("hoge4",'a1', this.TASKs),
      _todo("hoge5",'a2', this.TASKs),
      _todo("hoge6",'a2', this.TASKs),
      _todo("hoge7",'a1', this.TASKs),
      _todo("hoge8",'a2', this.TASKs),
      _todo("hoge9",'a2', this.TASKs),
      _todo("hoge10",'a2', this.TASKs),
      _todo("hoge11",'a2', this.TASKs),
      _todo("hoge12",'a3', this.TASKs),
      _todo("hoge13",'a4', this.TASKs),
      _todo("hoge14",'a4', this.TASKs),
      _todo("hoge15",'a3', this.TASKs),
      _todo("hoge16",'a4', this.TASKs),
      _todo("hoge17",'a4', this.TASKs),
      _todo("hoge18",'a4', this.TASKs),
      _todo("hoge19",'a4', this.TASKs),
      _todo("hoge20",'a3', this.TASKs),
    ]
    console.log(this.TODOs)    

  },
  // 物理マウント完了時
  mounted: function () {
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  },
}

var todoID = 19010100000
var taskID = 19010100000

var TASKs = [

]
console.log(TASKs)
function  _task(label, stat, no){
  taskID ++;
  return {
    id: 'T'+taskID,
    TodoID: (todoID*1 + no),
    label: label,
    status: stat || '_'
  }
}



function _todo(title, area,tasks){
  ++ todoID;
  return new TODO({
    "id": todoID,
    "title": title,
    "area" : area,
    "unitTime": 15,
    "schedule": '190105',
    'remarks':'あけおめことよろ',
    "tasks": tasks.filter((task) => { return ( task.TodoID === todoID )})
  })
}


</script>
<style>
  html,body,#app{
    height:100%; width:100%;
    overflow: hidden;
  }
  ul, ol, dl, li, dd, dt{
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .bgc-area1{
      background-color: rgba(255,180,180,0.75);
  }
  .bgc-area2{
      background-color: rgba(255,255,180,0.75);
  }
  .bgc-area3{
      background-color: rgba(180,180,255,0.75);
  }
  .bgc-area4{
      background-color: #9F9;
  }
</style>
