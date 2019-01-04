<template>
  <div id="app" :class="myClass">
    <!-- メインエリア（排他選択する） -->
    <b-row id="main" class="no-gutters h100" :style="mainHeight" >
      <b-col md="11" style="height:100%" >
        <TodoNoteView :show="true" :lotate="lotate" @show="viewActive">
          <TodoNoteMainView :TODOs="QueryTODOs" @update="onUpdate" />
        </TodoNoteView>
      </b-col>
      <b-col md="1">
        <!-- クエリーコントロールPC -->
        <TodoNoteSideBar :show="lotate=='landscape'" @edit="onEdit" />
     </b-col>
    </b-row>

    <TodoNoteEditView ref="edit" @update="onUpdate" />
</div>
</template>
<script>

// vue controller
import TodoNoteView from './components/TodoNoteView'
import TodoNoteViewSelector from './components/mixin/TodoNoteViewSelector'

// router 使ってないのでこちらで制御している
// Views
import TodoNoteMainView from './components/view/TodoNoteMainView'
import TodoNoteEditView from './components/view/TodoNoteEditView'
import TodoNoteSideBar from './components/view/TodoNoteSideBar'
import TodoNoteFooter from './components/view/TodoNoteFooter'
import Query from './components/mixin/Query'


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
  mixins:[Query, TodoNoteViewSelector],
  components: {
    TodoNoteView,
    TodoNoteSideBar,
    TodoNoteFooter,
    TodoNoteMainView,
    TodoNoteEditView,
  },
  props:{
  },
  computed:{
    myClass: function(){
      return [
        'screen-'+this.size,
        'screen-'+this.lotate,
      ]
    },
    QueryTODOs : function(){
      return this.queryLiveTodo( this.TODOs )
    },
    mainHeight: function(){
      return 'height:100%';
    },

    footerHeight: function(){
      return 'height:0';
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
    /**
     * ビューコンポネントの更新ハンドラ
     * 画面描画切り替え 指示
     */
    onUpdate: function( payload ){
      // 
      this.$forceUpdate()
    },

    /**
     * 表示されたビューからクエリー条件を受け取るイベントハンドラ
     */
    onCondition: function( payload ){
    },

    /**
     * TODO表示のクエリーイベントハンドラ
     */
    onQuery: function( payload ){

    },

    onEdit:function(todoId){
      // seek 
      let edit = new TODO();
      this.$refs.edit.show(edit)
    },

    /**
     * ブラウザー画面のリサイズ判定
     * Bootstrap の GRID表示 モード追跡
     */
    onWindowResize: function(){
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.size = Object.keys(BootStrapBreakPoint).find((ix) => {
        return (this.windowWidth >= BootStrapBreakPoint[ix] )
      })
      this.lotate = ((this.windowWidth - UI_BAR_WIDTH_S) > (this.windowHeight-UI_BAR_HEIGHT))? "landscape": "portrait"
    }
  },

  /**
   * 描画前起動処理
   */
  created:function(){
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
    console.log(this.TASKs)

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
  /**
   * 物理マウント完了時
   */
  mounted: function () {
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  },

}

// ダミーデータ
var todoID = 19010100000
var taskID = 19010100000

function  _task(label, stat, no){
  taskID ++;
  return new TASK({
    id: 'T'+taskID,
    TodoID: (todoID*1 + no),
    label: label,
    status: stat || '_'
  })
}
function _todo(title, area,tasks){
  ++ todoID;
  return new TODO({
    "id": todoID,
    "title": title,
    "area" : area,
    "unitTime": 15,
    "schedule": '20190102',
    'remarks':'あけおめことよろ',
    "tasks": tasks.filter((task) => { return ( task.TodoID === todoID )})
  })
}


</script>
<style>
  html,body,#app{
    height:100%; 
    width:100%;
    overflow: hidden;
  }
  ul, ol, dl, li, dd, dt{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  #main, #main >*{
      height:100%;
  }  
  .screen-sm #main, .screen-xs #main {
    height:auto;
  }
  #app.screen-sm , #app.screen-xs {
    overflow: auto;
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

  .mt0  { margin-top:  0px !important; }
  .mt10 { margin-top: 10px !important; }
  .mt20 { margin-top: 20px !important; }
  .mt30 { margin-top: 30px !important; }
  .mt40 { margin-top: 40px !important; }

  .mb0  { margin-bottom:  0px !important; }
  .mb10 { margin-bottom: 10px !important; }
  .mb20 { margin-bottom: 20px !important; }
  .mb30 { margin-bottom: 30px !important; }
  .mb40 { margin-bottom: 40px !important; }

  .innertWrap {
    padding: .5rem;
  }

</style>
