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
              <p>{{  }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{  }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{  }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box">
              <p>{{  }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{  }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{  }}</p>
            </div>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <div class="box">
              <p>{{  }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{  }}</p>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <p>{{  }}</p>
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
  },
  data() {
    return {
      bingoItemDocRefs: [null, null, null, null, null, null],
      bingoDocRef: null,
      currentIndex: -1,
      userName: "テスト太郎",
      bingoName: "おもしろ",
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