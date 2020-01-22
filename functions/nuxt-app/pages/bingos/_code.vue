<template>
  <section class="section">
    <div class="container">
      <h1 class="is-size-1 has-text-centered">Bingo</h1>
        <div style="margin-top: 24px;" class="has-text-centered">
            <p><span class="is-size-4">{{ ownerName }}</span>さんが作った<br /><span class="is-size-3">{{ bingoName }}</span>ビンゴ<br />に参加しますか？</p>
        </div>
        <b-field style="margin-top: 24px;" label="ユーザー名">
          <b-input v-model="userName"></b-input>
        </b-field>
        <div class="bingo">
        <div class="columns is-mobile">
          <div class="column">
            <div class="box">
              <p>{{ bingoItems[0] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ bingoItems[1] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ bingoItems[2] }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box">
              <p>{{ bingoItems[3] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ bingoItems[4] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ bingoItems[5] }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box">
              <p>{{ bingoItems[6] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ bingoItems[7] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{ bingoItems[8] }}</p>
            </div>
          </div>
        </div>
        </div>
      <div class="has-text-centered create">
        <b-button @click="join()">参加する</b-button>
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
      this.bingoCode = this.$route.params.code
      db.collection('bingos').doc(this.bingoCode).get()
        .then((doc) => {
          if (doc.exists) {
            console.log(doc.data().ownerRef)
            doc.data().ownerRef.get().then((owner) => {this.ownerName = owner.data().name})
            this.bingoName = doc.data().name
            this.bingoDocRef = doc.ref
            db.collection('bingoItems').where("bingoRef", '==', doc.ref).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log(doc.id + ":" + doc.data().index + ":" + doc.data().body)
                this.bingoItemDocRefs[doc.data().index] = doc.ref
                this.$set(this.bingoItems, doc.data().index, doc.data().body)
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
      bingoItems: ["","","","","","","","",""],
      bingoItemDocRefs: [null, null, null, null, null, null, null, null, null],
      bingoDocRef: null,
      currentIndex: -1,
      bingoName: "",
      userName: "",
      ownerName: "",
      bingoCode: "",
      sheetCode: ""
    }
  },
  methods: {
    join: function () {
      if ( this.userName == "") {
        console.log("blank user name")
        console.log(this.userName)
        return
      }
      db.collection("users").add({
        name: this.userName
      })
      .then((userRef) => {
        console.log(userRef.id)
        this.createSheet(userRef)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    createSheet: function(userRef) {
      let sheetRefId = ""
      db.collection("sheets").add({
        bingoRef: this.bingoDocRef,
        userRef: userRef
      })
      .then((sheetRef) => {
        sheetRefId = sheetRef.id
        console.log(sheetRef)
        this.shuffle(this.bingoItemDocRefs)
        this.bingoItemDocRefs.map((bingoItemDocRef, index) => {
          this.createSheetItem(sheetRef, bingoItemDocRef, index)
        });
      })
      .then(() => {
        this.sheetCode = sheetRefId
        this.$router.push(this.sheetUrl)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    createSheetItem: function(sheetRef, bingoItemDocRef, index) {
      db.collection("sheetItems").add({
          sheetRef: sheetRef,
          bingoItemRef: bingoItemDocRef,
          index: index,
          is_done: false
      })
      .then((SheetItemRef) => {
        console.log(sheetItemRef.id)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    shuffle: function (array) {
      array.sort(() => Math.random() - 0.5)
    }
  },
  computed: {
    sheetUrl: function() {
      if (process.env.NODE_ENV == 'development') {
        return '/bingos/' + this.bingoCode + '/sheets/' + this.sheetCode
      } else {
        return '/bingos/' + this.bingoCode + '/sheets/' + this.sheetCode
      }
    }
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