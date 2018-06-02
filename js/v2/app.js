var APP = APP || {}
APP.version = '2.00.00';
//---
(function(Vue){
   $.extend( APP,{
    ready : 0,
    getAPI:function (){
        return APP.API
    },
    getDB:function (){
        return APP.DB
    },
    show: (viewName) =>{
        if(!APP.view){
            return
        }
        APP.view._switchView(viewName)
    },
   })

    Vue.component(
        "kzc-test", {
            props: ["msg"],
            template: '<span>test:{{ msg }}</span>',
            methods: {},
            computed: { },
            mounted:function(){
                console.log("test!")
    
            },
        });
       
        
    /**
     * 汎用 Staff
     */
     Vue.component("kzc-staff",{
        template: '<kzc-avator v-bind="staff"/>' ,
        props: {
        },
        data: function(){
            return {
               staff:{
                "name"   : 'staff',
                "img_bas": "img/av/skin/03/bf01.gif",
                "img_hrb": "img/av/lbrwn/back_03.gif",
                "img_clt": "img/av/cloth/lobby.gif",
                "img_eye": "img/av/eye/blk/f02.gif",
                "img_hra": 'img/av/lbrwn/hacc_01.gif',
                "img_hrf": 'img/av/lbrwn/front_01.gif',
                } 
            }
        },
        mounted:function(){
            // console.log("staff")
            // console.log(this);
        },
     })
       
})(Vue);
