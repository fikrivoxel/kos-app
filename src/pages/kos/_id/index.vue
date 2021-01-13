<template>
  <b-row>
    <b-col cols="12">
      <b-jumbotron :header="kos.nama" :lead="`Alamat: ${kos.alamat || '-'}`">
        <p>Isi kamar kos anda</p>
        <b-button variant="primary" :to="toHalKos">
          Ke Halaman Kos
        </b-button>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<route>
{
  "meta": {
    "titlebar": {
      "title": "Home",
      "breadcrumbs": [
        {
          "text": "Home",
          "active": true
        }
      ]
    }
  }
}
</route>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("kos", {
      kos: "selected"
    }),
    toHalKos() {
      const id = this.$route.params?.id;
      return `/kos/${id}/kamar`;
    }
  }
};
</script>
