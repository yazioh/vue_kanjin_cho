var APP = APP || {};
(function(Vue){
    // timeLinePage 
    Vue.component("time-line", {
        props: ["msg"],
        template: '<div>test:{{ msg }}<slot /></div>',
        methods: {
            show:function(){
                console.log("show!!!!!")

            },
            hide:function(){
                console.log("hide!!!!!")
            },
        },
        computed: { },
        mounted:function(){
            console.log("time-line")
        },
    });
})(Vue);
