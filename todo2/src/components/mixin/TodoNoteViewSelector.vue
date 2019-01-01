<script>


// このエリアにアプリケーション定数を定義できるよね
/**
 * 共通ステータス
 */
const STATUS = {
    'o':'OK',
    '!':'UPDATED',
    'x':'DELETED'
} 

export default {
    tempplate: '<!-- ->',
    computed:{
        statusLabels:function(){
            return STATUS
        }

    },
    data: function(){
        return {
            hoge: 'hoge'
        }
    },
    methods: {
        viewActive:function(name,payload){
            console.log(name, payload)
        }
    },
    created: function(){
        console.log("mixn", "view selector")
    }

}
</script>