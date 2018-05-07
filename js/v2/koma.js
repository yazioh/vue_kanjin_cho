/**
 * "KOMA" を定義
 * KOMA はメッセージの単位
 * koma 
 *  +- bg
 *  +- size S/M/W .. 以下の内容により逐次変化
 *  +
 *  +- talk
 *    +- msgid
 *    +- chid
 *    +- msg
 *    +- time
 *    +- emotion
 *   
 *  +- reply [0-x] // 表現限界がある
 * 　　+msg[0]
 *       +- msgid
 *       +- chid
 *       +- msg
 *       +- time
 *       +- emotion  
 */
Vue.component("kzc-koma",{
    props: [
        "bg",
        "size",
        "talk",
        "repry"
    ],
    template :'<div class="koma" :class="komaSize">'
        +'<p v-if="selif" class="selif" :class="selif_type(talk.emotion)" v-html="TalkNl2Br"></p>'
        +'<kzc-avator v-bind="avatorOpt"/>'
        +'<i class="time">{{ fzTime }}</i>'
        +'<b class="name">{{ avaName }}</b>' 
        +'</div>',
    // 
    data :function(){return{
        bg: this.bg,
        size: this.size,
        talk: this.talk,
        reply: this.reply,
    }},
    computed: {
        selif: function(){
            return this.Nl2Br(this.talk.msg) 
        },

        komaSize: function () {
            let w = this.slfWidth("" + this.talk.msg);
            // TODO reply Width 
            if (w == 0) {
                return "w0";
            }
            if (w > 40) {
                return "w4";
            }
            if (w > 10) {
                return "w2";
            }
            return "w1";
        },    

        avatorOpt: function(){
           let tmp = APP.Avator.get(this.talk.chid)
           return tmp.getFace(this.talk.emotion)
           // { name:..., img_bas:.. ,...  }
        }
    },
    method: {
        Nl2Br:function(msg){
            let msg = msg || '';
            if(!msg){ return '' }
            let tmp = msg.talk.split("\n");
            return tmp.join('<br>'); 
        },

        selif_type:function( emo ){
            return "nrm"
        },

        // セリフ最大幅（全角幅2として）
        slfWidth:function(msg){
            let msg = msg || '';
            if(!msg){ return 0 }
            //
            var  mxW  = 0
            msg.split("¥n").forEach(function(str, ix, ary){
                    let eStr = escape(str)
                    let zw =  str.length + (eStr.split("%u").length-1)
                    if( mxW < zw){
                        mxW = zw 
                        //console.log(str)
                    }
                } 
            )            
            return mxW
        }
    },

});