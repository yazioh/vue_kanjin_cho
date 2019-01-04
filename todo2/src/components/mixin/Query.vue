<script>
import CalDate from './CalDate'

/**
 * TODOとTASKのフィルター関数＆フィルタ合成
 * 
 * TODO ちょっとクエリ側が知りすぎてるので、getter利用へ
 */
export default {
  template: '<!-- -->',
  props:[],
  mixins:[CalDate],
  // 
  methods:{
    // 未削除TODO 
    queryLiveTodo:function(TODOs){
      if(!TODOs || !TODOs.filter){
        return []
      }
      return TODOs.filter((todo)=>{
          return todo.isGoing();
      })
    },
    

    // 未チェックのあるTODO
    queryGoingTodo:function(TODOs){
      if(!TODOs || !TODOs.filter){
        return []
      }
      return TODOs.filter((todo)=>{
        let tasks = todo.getGoingTask()
        return (tasks.length >0);
      })
    },

    /**
     * タスクエリアで絞り込み
     */
    queryTasksArea:function(TODOs , area){
      return TODOs.filter((todo)=>{
          return(todo.area ==area)
      })
    },
    
    queryScheduleToday:function(TODOs){
      let today = this.Ymd()
      return TODOs.filter((todo)=>{
        return(todo.schedule === today)
      })
    },

    queryNotScheduled:function(TODOs){
      // let today = this.Ymd()
      return TODOs.filter((todo)=>{
        return(todo.schedule === '')
      })
    }

  }
}
</script>
