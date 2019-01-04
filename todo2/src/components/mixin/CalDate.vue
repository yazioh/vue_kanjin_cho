<script>
/**
 * カレンダー関連の小技
 */
export default {
  template: '<!-- -->',
  
  methods:{
    
    Ymd:function(d=''){
      let dt = (d)? d: new Date()
      return [
        dt.getFullYear(),
        ("00" + (dt.getMonth()+1)).slice(-2),
        ("00" + dt.getDate()).slice(-2),
      ].join("")
    },

  }
}
</script>
