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
          <b-card v-for="(list, i) in lists" :key="i" no-body>
            <b-card-header class="d-flex align-items-center bg-dark text-white">
              <b-link class="text-white">
                {{ list.nama }}
              </b-link>
              <button
                class="ml-auto close text-white"
                style="font-size: 1rem;"
                @click="clickHapus(list.id)"
              >
                <fa-layers class="fa-fw">
                  <fa-icon :icon="['fas', 'times']" />
                </fa-layers>
              </button>
            </b-card-header>
            <b-list-group flush>
              <b-list-group-item>
                Harga: {{ list.harga_default | toRupiah }}
              </b-list-group-item>
              <b-list-group-item>
                Alamat: {{ list.alamat || "-" }}
              </b-list-group-item>
            </b-list-group>
            <b-card-footer>
              <b-button
                variant="primary"
                size="sm"
                class="w-100"
                @click="clickGanti(list.id)"
              >
                <fa-layers class="fa-fw">
                  <fa-icon :icon="['fas', 'edit']" />
                </fa-layers>
                Ganti
              </b-button>
            </b-card-footer>
          </b-card>
        </b-card-group>
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

export default {
  components: {
    TitleBar,
    TambahSidebar,
    GantiSidebar
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
      try {
        await this.$store.dispatchPromise("kos/getAll", {
          page: this.page,
          perpage: this.perpage,
          ...this.cari
        });
        // eslint-disable-next-line no-empty
      } catch (err) {}
    }
  },
  filters: {
    toRupiah(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(number);
    }
  }
};
</script>
