<template lang="pug">
    v-app
        .header(:style="{ backgroundImage: `url(${image})`}")
            .logo
                span.t1 XL
                span.t2 edit
            a(href='https://github.com/Hoogkamer/xledit' target='_blank' title='Github repository')
              img.github(src='@/assets/images/GitHub-Mark-64px.png')
            table
                tr
                    td
                        .message A web app for excel sheets.
                        NuxtLink(to="/app") 
                          .button 
                            .bt GET STARTED
                    td
                        img.apptitle(src='@/assets/images/undraw_feeling_proud_qne1.svg')
        .content
          .section
            .title - A very easy solution to visualise and edit excel sheets -
            .cont Are you using excel to manage data? Do you need an easy web based solution to manage lists of data? Then this app is for you! You specify what you want. Then this app automatically creates an application with sorts and filters and edit function for you excel sheets. You can get started in minutes!
            .cont -
            .cont All processing happens in your browser on your computer only. So nothing is sent to a webserver. Your data stays safe. Visit the 
              a(href='https://github.com/Hoogkamer/xledit' target='_blank') Github page
            .cont -
            .cont For example: create an app to manage your collection of music albums, with artists and songs. Download this excel and then open in the application to see an example: 
              a(href='./CD_Database.xlsx' download) CD database
          .section
            table
              tr
                td
                  .count 1
                  .text Open an excel sheet or start from scratch. Click the pencil on the right and define the columns you need. 
                td
                  img.screen(src='@/assets/images/screen3.png')
            table
              tr
                td
                  img.screen(src='@/assets/images/screen2.png')
                td
                  .count 2
                  .text Click on button Create New and enter some data. Save your data in excel
            table
              tr 
                td
                  .count 3
                  .text Now filter, search and browse your data. Press the children icons to view the connected data from another excel sheet if applicable
                img.screen(src='@/assets/images/screen1.png')
        
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
  margin-top: 50px;
}
.header {
  width: 100%;
  height: 400px;
  background-size: cover;
}
td {
  vertical-align: top;
  padding: 0px 20px;
}
.line {
  width: 100%;
  margin: 0px 20px;
  text-align: center;
  font-size: 60px;
  color: white;
}
.button {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
.bt {
  font-size: 20px;
  color: white;
  font-weight: 600;
  display: inline-block;
  padding: 10px 26px;
  margin: 10px;
  border: 1px solid white;
  cursor: pointer;
}
.bt:hover {
  color: lightgray;
  border-color: lightgray;
}
.header a:visited {
  color: white;
}
.header a {
  color: white;
}
.content {
  margin-top: 100px;
  width: 100%;
  text-align: center;
  margin-bottom: 40px;
}
.section {
  max-width: 1100px;
  margin: auto;
}
.title {
  text-transform: uppercase;
  color: grey;
  margin: 20px 0px;
}
.screen {
  border: 1px solid grey;
  border-radius: 10px;
  width: 700px;
}
.count {
  font-size: 80px;
  color: lightgray;
}
.text {
  color: grey;
  font-size: 18px;
}
.github {
  float: right;
  height: 50px;
  margin: 20px;
}
</style>
