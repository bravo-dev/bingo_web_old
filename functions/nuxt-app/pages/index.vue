<template>
  <section class="section">
    <div class="container">
      <h1 class="is-size-1 has-text-centered">Bingo</h1>
        <b-field label="ビンゴ名">
          <b-input v-model="bingoName"></b-input>
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
        <b-button>ビンゴを作る</b-button>
      </div>
    </div>

    <b-modal :active.sync="isModalActive" :width="640" scroll="keep">
      <nav class="panel">
        <p class="panel-heading">
          内容
        </p>
        <div class="panel-block">
          <b-input v-model="bingoItems[currentIndex]"></b-input>
        </div>
        <div class="panel-block">
          <button class="button is-fullwidth is-outlined" v-on:click="hideModal()">登録</button>
        </div>
      </nav>
    </b-modal>
  </section>
</template>
<script>
export default {
  data() {
    return {
      isModalActive: false,
      bingoItems: ["","","","","","","","",""],
      currentIndex: -1,
      bingoName: ""
    }
  },
  methods: {
    showModal: function (idx) {
      this.currentIndex = idx
      this.isModalActive = true
    },
    hideModal: function (idx) {
      this.isModalActive = false
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