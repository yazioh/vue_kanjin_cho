<template>
    <div class="todo-view" id="sidebar" style="stylePrpos">
        <div class="content">
          <b-form-row>
            <b-col cols="3" md="12">
                <b-form-row>
                    <b-col>
                        <lgBtn title="メインビュー" @click="shoeViews" ><iconFont name="th-large" type="fas"/></lgBtn>
                    </b-col>
                </b-form-row>

            </b-col>
            <b-col cols="2" md="12">

                <!-- -->
                <b-form-row>
                    <b-col>
                        <smBtn title="検索条件" @click="shoWQuery" >
                            <iconFont name="search" /><span>絞込み</span>
                        </smBtn>
                    </b-col>
                </b-form-row>
            </b-col>
            <b-col cols="2" md="12">

                <!-- -->
                <b-form-row>
                    <b-col>
                        <smBtn title="検索条件" @click="showTag" >
                            <iconFont name="tag" /><span>タグ</span>
                        </smBtn>
                    </b-col>
                </b-form-row>

            </b-col>
            </b-form-row>
            
            <div class="button-wraper">
                <smBtn title="検索条件" @click="addTodo"  >
                    <iconFont name="sticky-note" type="far"/><span>追加</span>
                </smBtn>
            </div>
        </div>
        <SideBarTodoQuery ref="todoQuery" :condition="currentCond" @update="doQuery"/>
    </div>
</template>
<script>

import SideBarTodoQuery from '../elements/SideBarTodoQuery'
import SideBarTagQuery from '../elements/SideBarTagQuery'


export default {
    components: {
        panelRow:{

        },
        lgBtn:{
            template : `<b-btn size="sm" style="width:100%;line-height:1;font-size:200%;" variant="light" @click="onClick" ><slot /></b-btn>`,
            methods: {
                onClick:function(){this.$emit("click")}
            }
        },
        smBtn:{
            template : `
                <b-btn 
                    size="sm" 
                    style="width:100%" 
                    variant="light"
                    @click="onClick"
                ><slot /></b-btn>`,
            methods: {
                onClick:function(){this.$emit("click")}
            }
        },
        SideBarTodoQuery,
        SideBarTagQuery
    },
    props:{
        show:{
            default: false
        },
        currentCond:{}
    },

    computed:{
        stylePrpos: function(){
            let mystyle=[]
            return mystyle.join(";")
        },
        styleAddButton:function(){
            return ''
        }
    },

    methods:{
        shoeViews: function() {

        },
        shoWQuery: function() {
            this.$refs.todoQuery.show()
        },
        showTag: function() {

        },

        /**
         * 検索条件の変更を親に通知する
         */
        doQuery: function(upEvent) {
            // 親にも中継
            this.$emit("update",upEvent)
        },

        /**
         * 編集ダイアログを新規で開く
         */
        addTodo: function() {
            this.$emit("edit", {"from":'sideBar', payload:{}})
        }
    }
}
</script>

<style scoped>
#sidebar {
  position: relative;
  height:100%;
  background-color: #ccc;
}
#sidebar .content {
    padding:.5rem;
}
.form-row + .form-row {
    margin-top: .5rem;
}
button.btn-sm >span{
    padding-left: 0.25rem;
}
.screen-md button.btn-sm >span, 
.screen-sm button.btn-sm >span,
.screen-xs button.btn-sm >span{
    display: none
}

.button-wraper {
    position: absolute; 
    bottom: .5rem;
    right:.5rem;
    left:.5rem;
}
.screen-sm .button-wraper, .screen-xs .button-wraper {
    left: auto;
    width: 4em;
    bottom: auto;
    top: 0.5rem;
}
</style>
