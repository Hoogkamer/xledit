<template lang="pug">
    v-app
        .header(:style="{ backgroundImage: `url(${image})`}")
            .logo
                span.t1 XL
                span.t2 edit
            table
                tr
                    td
                        .message A Web front-end for excel
                    td
                        img.apptitle(src='@/assets/images/undraw_feeling_proud_qne1.svg')
   
</template>

<script>
import bikeImg from 'assets/images/background.jpg'
export default {
  data() {
    return {
      image: bikeImg,
    }
  },
}
</script>
<style scoped>
.logo {
  width: 400px;
  display: inline-block;
  font-size: 30px;
  color: white;
  margin: 30px;
}
.apptitle {
  width: 400px;
  margin-left: 200px;
}
.message {
  font-size: 36px;
  font-weight: 600;
  color: white;
  vertical-align: top;
  display: inline-block;
}
.header {
  width: 100%;
  height: 400px;
  background-size: cover;
}
td {
  vertical-align: top;
  padding: 20px;
}
</style>
