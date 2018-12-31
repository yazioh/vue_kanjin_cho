<template>
  <div id="app">
    <!-- メインエリア（排他選択する） -->
    <TodoNoteView :show="true" @show="viewActive">
      todoMainView
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


export default {
  name: 'App',
  mixins:[TodoNoteViewSelector],
  components: {
    TodoNoteView,
    
    TodoNoteSideBar,
    TodoNoteFooter,

    TodoNoteMainView,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
