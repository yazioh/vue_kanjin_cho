var APP = APP || {};
//---
(function(Vue){
    $.extend( APP,{
        version : '2.00.00',
        ready : 0,

        getAPI:function (){
            return APP.API
        },
        getDB:function (){
            return APP.DB
        },
        getAvator:function (){
            return new Avator()
        },

        show: (viewName) =>{
            if(!APP.view){
                return
            }
            if(viewName==='AvatorEdit'){
                // show modal ?
            }
            APP.view._switchView(viewName)
        },

        roomInfo : {
            "id":'',
            "name":'',
            "status":'',
            "update":''
        },
        setCurRoom: function( newRoomInfo ){
            $.extend( this.roomInfo, newRoomInfo)
            this.roomInfo.update = new Date()
        },

        player:{
            "chid": '',
            "face": {},
            "update":''
        },
        setPlayer:function(newPlayer){
            $.extend( this.player, newPlayer) 
            this.player.update = new Date()
        }
    });

    Vue.component(
        "kzc-test", {
            props: ["msg"],
            template: '<span>test:{{ msg }}</span>',
            methods: {},
            computed: { },
            mounted:function(){
    
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
