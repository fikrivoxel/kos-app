<template>
  <b-row>
    <b-col cols="12">
      <pencarian-kamar v-model="cari" />
    </b-col>
    <b-col cols="12">
      <b-card no-body header="Kamar">
        <b-table
          class="mb-0"
          :items="lists"
          :fields="fields"
          responsive
          show-empty
          striped
        >
          <template #empty>
            Kosong
          </template>
          <template #cell(dihuni)="{item}">
            <fa-layers
              :class="['fa-fw', item.dihuni ? 'text-success' : 'text-danger']"
            >
              <fa-icon :icon="['fas', 'bed']" />
            </fa-layers>
          </template>
        </b-table>
      </b-card>
    </b-col>
  </b-row>
</template>

<route>
{
  "meta": {
    "titlebar": {
      "title": "Kamar",
      "breadcrumbs": [
        {
          "text": "Home",
          "to": "/"
        },
        {
          "text": "Kamar",
          "active": true
        }
      ]
    }
  }
}
</route>

<script>
import { mapGetters } from "vuex";
import PencarianKamar from "@/components/kamar/pencarian";

export default {
  components: { PencarianKamar },
  data() {
    return {
      page: 1,
      perpage: 10,
      cari: {}
    };
  },
  computed: {
    ...mapGetters("kamar", ["lists", "pagination"]),
    fields() {
      return [
        { key: "nama", text: "nama" },
        { key: "harga", text: "Harga" },
        { key: "dihuni", text: "Dihuni" }
      ];
    }
  },
  watch: {
    cari: {
      deep: true,
      async handler() {
        await this.fetchData();
      }
    }
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.$store.dispatch("loading/start");
      try {
        await this.$store.dispatchPromise("kamar/getAll", {
          page: this.page,
          perpage: this.perpage,
          ...this.cari
        });
      } catch (err) {
        this.$store.dispatch("loading/fail");
      }
      this.$store.dispatch("loading/finish");
    }
  }
};
</script>
