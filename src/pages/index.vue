<template>
  <b-container fluid>
    <b-row>
      <title-bar title="Dashboard" :breadcrumbs="breadcrumbs" container />
      <b-col cols="12">
        <b-row>
          <b-col md="4">
            <b-input-group class="mb-3">
              <b-input placeholder="Cari Kos" v-model="cari.nama" />
              <b-input-group-append>
                <b-button variant="primary" @click="slide.tambah = true">
                  Tambah Kos
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12">
        <b-card v-if="!lists.length" class="bg-light p-3" no-body>
          Brand Tidak Ada
        </b-card>
      </b-col>
    </b-row>
    <tambah-sidebar v-model="slide.tambah" />
  </b-container>
</template>

<route>
{
  "meta": {
    "middleware": ["isauth"]
  }
}
</route>

<script>
import { mapGetters } from "vuex";
import TitleBar from "@/components/common/title-bar.vue";
import TambahSidebar from "@/components/kos/tambah/sidebar";

export default {
  components: {
    TitleBar,
    TambahSidebar
  },
  data() {
    return {
      page: 1,
      perpage: 10,
      cari: {
        nama: ""
      },
      slide: {
        tambah: false
      }
    };
  },
  computed: {
    ...mapGetters("kos", ["lists", "pagination"]),
    breadcrumbs() {
      return [
        {
          text: "Dashboard",
          active: true
        }
      ];
    }
  },
  watch: {
    async page() {
      await this.fetchData();
    },
    async perpage() {
      await this.fetchData();
    },
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
      try {
        await this.$store.dispatchPromise("kos/getAll", {
          page: this.page,
          perpage: this.perpage,
          ...this.cari
        });
        // eslint-disable-next-line no-empty
      } catch (err) {}
    }
  }
};
</script>
