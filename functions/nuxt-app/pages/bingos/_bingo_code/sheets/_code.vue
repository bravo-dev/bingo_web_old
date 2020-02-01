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
        <transition name="fade">
          <div v-if="isShowNotifyBingo" class="notification notification_bingo">
            <p>{{ notifyBingoBody }}</p>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="isShowNotifyDone" class="notification notification_done">
            <p>{{ notifyDoneBody }}</p>
          </div>
        </transition>
    </div>
  </section>
</template>
<script>
import firebase from '@/plugins/firebase'
const db = firebase.firestore();

export default {
  created() {

    const watchNotification = (doc) => {
      let isFirstChange = true
      console.log("called watchNotification")
      console.log(doc.data().bingoRef)
      db.collection("notifications").where("bingoRef", "==", doc.data().bingoRef)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type == "added" && !isFirstChange) {
              if (change.doc.data().sheetRef.id != this.sheetRef.id) {
                console.log("notify update state")
                console.log(change.doc)
                if (change.doc.data().type == "done") {
                  this.showNotifyDone(change.doc.data().body)
                } else if (change.doc.data().type == "bingo") {
                  this.showNotifyBingo(change.doc.data().body)
                }
              }
            }
          })
          isFirstChange = false
        })
     }

    const setItems = (doc) => {
      console.log("called setItems")
      db.collection('sheetItems').where("sheetRef", '==', doc.ref).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.data())
            this.$set(this.sheetItemDocs, doc.data().index, doc)
            const isDone = doc.data().is_done
            doc.data().bingoItemRef.get().then((bingoItem) => {
              this.$set(this.sheetItems, doc.data().index,
                {done: isDone, body: bingoItem.data().body})
              if (!this.sheetItems.includes(null)) {
                this.setBingos(this.sheetItems)
              }
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
      isShowNotifyDone: false,
      notifyDoneBody: "",
      isShowNotifyBingo: false,
      notifyBingoBody: "",
      bingos: [
          {line: [0 ,1 ,2], isDone: false},
          {line: [3 ,4 ,5], isDone: false},
          {line: [6 ,7 ,8], isDone: false},
          {line: [0 ,3 ,6], isDone: false},
          {line: [1 ,4 ,7], isDone: false},
          {line: [2 ,5 ,8], isDone: false},
          {line: [0 ,4 ,8], isDone: false},
          {line: [2 ,4 ,6], isDone: false}
        ]
    }
  },
  methods: {
    setBingos: function(sheetItems) {
      this.bingos.forEach((bingo) => {
        let isDone = true
        bingo.line.forEach((index) => {
          if (sheetItems[index].done == false) {
            isDone = false
          }
        })
        bingo.isDone = isDone
      })
    },
    done: function (idx) {
      this.sheetItems[idx].done = true
      console.log(this.sheetItemDocs[idx])
      this.sheetItemDocs[idx].ref.update({
        is_done: true
      })
      .then(() =>  {
        console.log("item become done")
        this.notifyDone(idx)
        this.checkBingo()
      })
    },
    notifyDone: function (idx) {
      db.collection('notifications').add({
        bingoRef: this.bingoRef,
        sheetRef: this.sheetRef,
        body: this.userName + "さんが " + this.sheetItems[idx].body + " のマスをあけました！",
        type: "done"
      })
      .then((notificationRef) => {
        console.log("done notified")
      })
      .catch((error) => {
        console.log("failed done notify")
      })
    },
    notifyBingo: function() {
      db.collection('notifications').add({
        bingoRef: this.bingoRef,
        sheetRef: this.sheetRef,
        body: this.userName + "さんがビンゴ成立しました！",
        type: "bingo"
      })
      .then((notificationRef) => {
        console.log("bingo notified")
      })
      .catch((error) => {
        console.log("failed bingo notify")
      })
    },
    showNotifyDone: function (notifyDoneBody) {
      console.log(notifyDoneBody)
      this.notifyDoneBody = notifyDoneBody
      this.isShowNotifyDone = true
      setTimeout(this.hideNotifyDone, 3000)
    },
    hideNotifyDone: function () {
      this.isShowNotifyDone = false
    },
    showNotifyBingo: function (notifyBingoBody) {
      console.log(notifyBingoBody)
      this.notifyBingoBody = notifyBingoBody
      this.isShowNotifyBingo = true
      setTimeout(this.hideNotifyBingo, 3000)
    },
    hideNotifyBingo: function () {
      this.isShowNotifyBingo = false
    },
    checkBingo: function() {
      if (!this.sheetItems.includes(null)) {
        console.log("call checkBingo")

        const items = this.sheetItems.map((item, index) => {
          item.oldIndex = index
          return item
        })
        console.log(items)
        const dones = items.filter((item, index) => {
          return (item.done == true)
        })
        console.log(dones)
        this.bingos.forEach((bingo) => {
          let isNotBingo = false
          bingo.line.forEach((index) => {
            if (!dones.map((done) => {return done.oldIndex}).includes(index)) {
              isNotBingo = true
            }
          })
          if (bingo.isDone == false && isNotBingo == false) {
            bingo.isDone = true
            console.log("bingo!!")
            this.notifyBingo()
          }
        })
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

.done {
  background-color: violet;
}

.notification_done {
  background-color: deepskyblue;
  color: white;
}

.notification_bingo {
  background-color: fuchsia;
  color: white;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-eter .fade-leave-to {
  opacity: 0;
}

</style>