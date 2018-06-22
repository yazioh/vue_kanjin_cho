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
 *  +- reply [0-x] // 表表示現限界がある
 * 　　+msg[0]
 *       +- msgid
 *       +- chid
 *       +- msg
 *       +- time
 *       +- emotion  
 */
Vue.component("kzc-koma",{
    template :`
<div class="koma" :class="komaSize">
<p v-if="selif" class="selif" :class="selif_type(talk.emotion)" v-html="selif"></p>
<kzc-avator v-bind="avatorOpt"/>
<i class="time">{{ fzTime }}</i>
<b class="name">{{ avaName }}</b>
</div>`,
    // 
    props: [
        "bg",
        "size",
        "talk",
        "repry"

    ],
    data :function(){return{
        avaName :'',
        avatorOpt: {
            "name":'',
            "img_emb":'',
            "img_bas":'',
            "img_hrb":'',
            "img_clt":'',
            "img_fca":'',
            "img_eye":'',
            "img_hra":'',
            "img_hrf":'',
            "img_emf":'',
    
            "bg_color":'',
            "rotate":'',
            "reverce":'',
        }
    }},
    mounted:function(){
       this.loadAvator()
    },
    computed: {
        selif: function(){
            return this.Nl2Br(this.talk.talk);
        },
        komaSize: function () {
            let w = this.slfWidth("" + this.talk.talk);
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
        fzTime: function(){
            return '';
        },
    },
    methods: {
        loadAvator: function (){
            let x=1
            APP.getDB().getAvator(this.talk.chid)
                .then((res)=>{
                    let tmp = new Avator(res)
                    this.avaName = tmp.name
                    // clone してコマ毎のユニーク性確保
                    let images = Avator.build($.extend({},res.face,this.talk.emo))
                    $.extend(this.avatorOpt, images);
                    console.log(this.avatorOpt)
                });
        },

        Nl2Br:function(msg){
            msg = (''+msg || '').trim();
            if(!msg){ return '' }
            let tmp = msg.split("\n");
            return tmp.join('<br>'); 
        },
        selif_type:function( emo ){
            return "nrm"
        },

        // セリフ最大幅（全角幅2として）
        slfWidth: function(msg){
            msg = msg || '';
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