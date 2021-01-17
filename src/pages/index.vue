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
        <b-card-group deck>
          <template v-for="(list, i) in lists">
            <card-kos
              :list="list"
              :key="i"
              @ganti="clickGanti"
              @hapus="clickHapus"
            />
          </template>
        </b-card-group>
      </b-col>
      <b-col v-if="lists.length" cols="12">
        <b-pagination
          v-model="page"
          class="my-3"
          :total-rows="pagination.total_record"
          :per-page="perpage"
          align="center"
        />
      </b-col>
    </b-row>
    <tambah-sidebar v-model="slide.tambah" @re-fetch="fetchData" />
    <ganti-sidebar v-model="slide.ganti" @re-fetch="fetchData" />
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
import TambahSidebar from "@/components/kos/slide/tambah";
import GantiSidebar from "@/components/kos/slide/ganti";
import CardKos from "@/components/kos/card";

export default {
  components: {
    TitleBar,
    TambahSidebar,
    GantiSidebar,
    CardKos
  },
  data() {
    return {
      page: 1,
      perpage: 10,
      cari: {
        nama: ""
      },
      slide: {
        tambah: false,
        ganti: false
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
    async clickHapus(id) {
      try {
        await this.$store.dispatchPromise("kos/destroy", {
          id
        });
        await this.fetchData();
        this.$bvToast.toast("Berhasil hapus kos", {
          title: "Success",
          variant: "success",
          solid: true,
          toaster: "b-toaster-bottom-right",
          appendToast: true
        });
      } catch (err) {
        this.$bvToast.toast(err.message, {
          title: "Error",
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right",
          appendToast: true
        });
      }
    },
    async clickGanti(id) {
      try {
        await this.$store.dispatchPromise("kos/getById", {
          id
        });
        this.slide.ganti = true;
      } catch (err) {
        this.$bvToast.toast(err.message, {
          title: "Error",
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right",
          appendToast: true
        });
      }
    },
    async fetchData() {
      this.$store.dispatch("loading/start");
      try {
        await this.$store.dispatchPromise("kos/getAll", {
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
