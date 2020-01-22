<template>
  <section class="section">
    <div class="container">
      <h1 class="is-size-1 has-text-centered">Bingo</h1>
        <div style="margin-top: 24px;" class="has-text-centered">
            <p><span class="is-size-4">test</span>さんが作った<br /><span class="is-size-3">test</span>ビンゴ<br />に参加しますか？</p>
        </div>
        <b-field style="margin-top: 24px;" label="ユーザー名">
          <b-input v-model="userName"></b-input>
        </b-field>
        <div class="bingo">
        <div class="columns is-mobile">
          <div class="column">
            <div class="box" v-on:click="showModal(0)">
              <p>{{ bingoItems[0] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-on:click="showModal(1)">
              <p>{{ bingoItems[1] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-on:click="showModal(2)">
              <p>{{ bingoItems[2] }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box" v-on:click="showModal(3)">
              <p>{{ bingoItems[3] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-on:click="showModal(4)">
              <p>{{ bingoItems[4] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-on:click="showModal(5)">
              <p>{{ bingoItems[5] }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box" v-on:click="showModal(6)">
              <p>{{ bingoItems[6] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-on:click="showModal(7)">
              <p>{{ bingoItems[7] }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-on:click="showModal(8)">
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
            this.bingoName = doc.data().name
            db.collection('bingoItems').where("bingoRef", '==', doc.ref).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log(doc.id + ":" + doc.data().index + ":" + doc.data().body)
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
      isModalActive: false,
      bingoItems: ["","","","","","","","",""],
      currentIndex: -1,
      bingoName: "",
      userName: "",
      bingoCode: ""
    }
  },
  methods: {
    showModal: function (idx) {
      this.currentIndex = idx
      this.isModalActive = true
    },
    hideModal: function (idx) {
      this.isModalActive = false
    },
    create: function () {
      if ( this.onwerName == "" || this.bingoName == "" || this.bingoItems.includes("")) {
        console.log("blank item exist!")
        console.log(this.ownerName)
        console.log(this.bingoName)
        console.log(this.bingoItems)
        return
      }
      db.collection("users").add({
        name: this.ownerName
      })
      .then((userRef) => {
        console.log(userRef.id)
        this.createBingo(userRef)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    createBingo: function(userRef) {
      let bingoRefId = ""
      db.collection("bingos").add({
        name: this.bingoName,
        ownerRef: userRef
      })
      .then((bingoRef) => {
        console.log(bingoRef)
        bingoRefId = bingoRef.id
        this.bingoItems.map(bingoItem => {
          this.createBingoItem(bingoRef, bingoItem)
        });
      })
      .then(() => {
        this.bingoCode = bingoRefId
      })
      .catch((error) => {
        console.log(error)
      })
    },
    createBingoItem: function(bingoRef, bingoItem) {
      db.collection("bingoItem").add({
          item: bingoItem,
          bingoRef: bingoRef
      })
      .then((bingoItemRef) => {
        console.log(bingoItemRef.id)
      })
      .catch((error) => {
        console.log(error)
      })
    },
  },
  computed: {
    bingoUrl: function() {
      if (process.env.NODE_ENV == 'development') {
        return 'http://localhost:3000' + '/bingos/' + this.bingoCode
      } else {
        return 'https://bingo-bravo.firebaseapp.com' + '/bingos/' + this.bingoCode
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