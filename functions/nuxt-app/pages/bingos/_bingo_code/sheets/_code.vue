<template>
  <section class="section">
    <div class="container">
      <h1 class="is-size-1 has-text-centered">Bingo</h1>
        <div style="margin-top: 24px;" class="has-text-centered">
            <p><span class="is-size-4">{{ userName }}</span>さんの<br /><span class="is-size-3">{{ bingoName }}</span>ビンゴシート</p>
        </div>
        <div class="bingo">
        <div class="columns is-mobile">
          <div class="column">
            <div class="box">
              <p>{{ sheetItems[0] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ sheetItems[1] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ sheetItems[2] }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box">
              <p>{{ sheetItems[3] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ sheetItems[4] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ sheetItems[5] }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box">
              <p>{{ sheetItems[6] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ sheetItems[7] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ sheetItems[8] }}</p>
            </div>
          </div>
        </div>
        </div>
    </div>
  </section>
</template>
<script>
import firebase from '@/plugins/firebase'
const db = firebase.firestore();

export default {
  created() {
      console.log(this.$route)
      this.sheetCode = this.$route.params.code
      db.collection('sheets').doc(this.sheetCode).get()
        .then((doc) => {
          if (doc.exists) {
            doc.data().userRef.get().then((user) => {this.userName = user.data().name})
            doc.data().bingoRef.get().then((bingo) => {this.bingoName = bingo.data().name})
            console.log('test')
            db.collection('sheetItems').where("sheetRef", '==', doc.ref).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                this.$set(this.sheetItemDocRefs, doc.data().index, doc.ref)
                doc.data().bingoItemRef.get().then((bingoItem) => {
                  this.$set(this.sheetItems, doc.data().index, bingoItem.data().body)
                })
              })
            })
          } else {
            console.log("no document")
          }
        })
        .catch((error) => {
          console.log(error)
        })
  },
  data() {
    return {
      sheetItemDocRefs: [null, null, null, null, null, null, null, null, null],
      sheetItems: ["", "", "", "", "", "", "", "", ""],
      currentIndex: -1,
      userName: "",
      bingoName: "",
      bingoCode: "",
      sheetCode: ""
    }
  },
  methods: {
  }
}
</script>
<style scoped>
.box {
  background-color: #00C4A7;
  height: 120px;
}
.column {
  padding: 2px;
}
.bingo {
  padding-top: 24px;
  padding-bottom: 24px;
}
.create {
  margin-top: 24px;
}
.box p {
  color: white;
}
nav.panel {
  margin: 8px;
  background-color: white;
}
.panel .panel-heading {
  background-color: #00C4A7;
  color: white;
}
</style>