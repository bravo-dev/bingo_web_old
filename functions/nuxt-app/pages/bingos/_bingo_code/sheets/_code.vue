<template>
  <section class="section">
    <div class="container">
      <h1 class="is-size-1 has-text-centered">Bingo</h1>
        <div style="margin-top: 24px;" class="has-text-centered">
            <p><span class="is-size-4">{{ userName }}</span>さんの<br /><span class="is-size-3">{{ bingoName }}</span>ビンゴシート</p>
        </div>
        <div v-if=" !sheetItems.includes(null) " class="bingo">
        <div class="columns is-mobile">
          <div class="column">
            <div class="box" v-bind:class="{ done: sheetItems[0].done }" v-on:click="done(0)">
              <p>{{ sheetItems[0].body }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-bind:class="{ done: sheetItems[1].done }" v-on:click="done(1)">
              <p>{{ sheetItems[1].body }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-bind:class="{ done: sheetItems[2].done }" v-on:click="done(2)">
              <p>{{ sheetItems[2].body }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box" v-bind:class="{ done: sheetItems[3].done }" v-on:click="done(3)">
              <p>{{ sheetItems[3].body }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-bind:class="{ done: sheetItems[4].done }" v-on:click="done(4)">
              <p>{{ sheetItems[4].body }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-bind:class="{ done: sheetItems[5].done }" v-on:click="done(5)">
              <p>{{ sheetItems[5].body }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box" v-bind:class="{ done: sheetItems[6].done }" v-on:click="done(6)">
              <p>{{ sheetItems[6].body }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-bind:class="{ done: sheetItems[7].done }" v-on:click="done(7)">
              <p>{{ sheetItems[7].body }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box" v-bind:class="{ done: sheetItems[8].done }" v-on:click="done(8)">
              <p>{{ sheetItems[8].body }}</p>
            </div>
          </div>
        </div>
        </div>
        <div v-if="isShowNotify" class="notification is-primary">
          <p>{{ notifyBody }}</p>
        </div>
    </div>
  </section>
</template>
<script>
import firebase from '@/plugins/firebase'
const db = firebase.firestore();

export default {
  created() {

    const watchNotification = (doc) => {
      console.log("called watchNotification")
      console.log(doc.data().bingoRef)
      db.collection("notifications").where("bingoRef", "==", doc.data().bingoRef)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type == "added") {
              console.log("notify update state")
              console.log(change.doc)
              this.showNotify(change.doc.data().body)
            }
          })
        })
     }

    const setItems = (doc) => {
      console.log("called setItems")
      db.collection('sheetItems').where("sheetRef", '==', doc.ref).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.$set(this.sheetItemDocs, doc.data().index, doc)
            doc.data().bingoItemRef.get().then((bingoItem) => {
              this.$set(this.sheetItems, doc.data().index,
                {done: false, body: bingoItem.data().body})

            })
          })
        })
      return Promise.resolve(doc)
     }

     const setUserName = (doc) => {
       console.log("called setUserName")
        doc.data().userRef.get().then((user) => {
          this.userName = user.data().name
        })
        return Promise.resolve(doc)
     }

    const setBingoName = (doc) => {
      console.log("called setBingoName")
        doc.data().bingoRef.get().then((bingo) => {
          this.bingoName = bingo.data().name
        })
        return Promise.resolve(doc)
    }

    const setSheet = (doc) => {
      console.log("called setSheet")
      if (doc.exists) {
        this.sheetRef = doc.ref
        this.bingoRef = doc.data().bingoRef
        return Promise.resolve(doc)
      } else {
        console.log("no document")
      }
    }

    const onRejected = (err) => {
      console.log(err)
    }

    const getSheet = (sheetCode) => {
      console.log("call getSheet")
      db.collection('sheets').doc(this.sheetCode).get()
        .then(setSheet, onRejected)
        .then(setBingoName, onRejected)
        .then(setUserName, onRejected)
        .then(setItems, onRejected)
        .then(watchNotification)
    }

    console.log(this.$route)
    this.sheetCode = this.$route.params.code

    getSheet(this.sheetCode)

  },
  data() {
    return {
      sheetItemDocs: [null, null, null, null, null, null, null, null, null],
      sheetItems: [null, null, null, null, null, null, null, null, null],
      currentIndex: -1,
      userName: "",
      bingoName: "",
      bingoCode: "",
      sheetCode: "",
      bingoRef: null,
      sheetRef: null,
      isShowNotify: false,
      notifyBody: ""
    }
  },
  methods: {
    done: function (idx) {
      this.sheetItems[idx].done = true
      console.log(this.sheetItemDocs[idx])
      this.sheetItemDocs[idx].ref.update({
        is_done: true
      })
      .then(() =>  {
        console.log("item become done")
        this.notify(idx)
      })
    },
    notify: function (idx) {
      db.collection('notifications').add({
        bingoRef: this.bingoRef,
        sheetRef: this.sheetRef,
        body: this.userName + "さんが " + this.sheetItems[idx].body + " のマスをあけました！"
      })
      .then((notificationRef) => {
        console.log("notified")
      })
      .catch((error) => {
        console.log("failed notify")
      })
    },
    showNotify: function (notifyBody) {
      console.log(notifyBody)
      this.notifyBody = notifyBody
      this.isShowNotify = true
      setTimeout(this.hideNotify, 3000)
    },
    hideNotify: function () {
      this.isShowNotify = false
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

.done {
  background-color: violet;
}
</style>