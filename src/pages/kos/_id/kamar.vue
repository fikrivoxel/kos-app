<template>
  <b-row>
    <b-col cols="12">
      <pencarian-kamar v-model="cari" />
    </b-col>
    <b-col cols="12">
      <b-card no-body class="mb-3">
        <b-card-header class="d-flex align-items-center">
          Kamar
          <b-button-group size="sm" class="ml-auto">
            <b-button
              variant="primary"
              v-b-tooltip.hover
              title="Tambah Satuan"
              @click="slide.tambah_satuan = true"
            >
              <fa-layers class="fa-fw">
                <fa-icon :icon="['fas', 'plus']" />
              </fa-layers>
            </b-button>
            <b-button
              variant="danger"
              v-b-tooltip.hover
              title="Tambah Banyak"
              @click="slide.tambah_bulk = true"
            >
              <fa-layers class="fa-fw">
                <fa-icon :icon="['fas', 'plus-square']" />
              </fa-layers>
            </b-button>
            <b-button
              variant="info"
              @click="refresh"
              v-b-tooltip.hover
              title="Refresh"
            >
              <fa-layers class="fa-fw">
                <fa-icon :icon="['fas', 'sync']" spin />
              </fa-layers>
            </b-button>
            <b-dropdown
              right
              size="sm"
              variant="secondary"
              split
              v-b-tooltip.hover
              title="Perhalaman"
            >
              <template #button-content>
                {{ perpage }}
              </template>
              <template v-for="(prpage, i) in perpages">
                <b-dropdown-item :key="i" @click="perpage = prpage">
                  {{ prpage }}
                </b-dropdown-item>
              </template>
            </b-dropdown>
          </b-button-group>
        </b-card-header>
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
          <template #cell(actions)="{item}">
            <b-button-group size="sm">
              <b-button variant="primary" @click="getData(item)">
                <fa-layers :class="['fa-fw']">
                  <fa-icon :icon="['fas', 'edit']" />
                </fa-layers>
              </b-button>
              <b-button
                v-if="!item.dihuni"
                variant="danger"
                @click="hapusKamar(item)"
              >
                <fa-layers :class="['fa-fw']">
                  <fa-icon :icon="['fas', 'trash']" />
                </fa-layers>
              </b-button>
              <b-button v-if="item.dihuni" variant="primary">
                Check Pembayaran
              </b-button>
            </b-button-group>
          </template>
        </b-table>
        <b-card-footer v-if="pagination.total_page >= 2">
          <b-pagination v-model="page" align="center" class="mb-0" />
        </b-card-footer>
      </b-card>
    </b-col>
    <tambah-satuan v-model="slide.tambah_satuan" @re-fetch="fetchData" />
    <tambah-bulk v-model="slide.tambah_bulk" @re-fetch="fetchData" />
    <ganti v-model="slide.ganti" @re-fetch="fetchData" />
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
import TambahSatuan from "@/components/kamar/slide/tambah";
import TambahBulk from "@/components/kamar/slide/tambah-bulk";
import Ganti from "@/components/kamar/slide/ganti";

export default {
  components: { PencarianKamar, TambahSatuan, TambahBulk, Ganti },
  data() {
    return {
      page: 1,
      perpage: 10,
      cari: {},
      slide: {
        tambah_satuan: false,
        tambah_bulk: false,
        ganti: false,
        lihat: false
      }
    };
  },
  computed: {
    ...mapGetters("kamar", ["lists", "pagination"]),
    ...mapGetters("kos", {
      kos: "selected"
    }),
    fields() {
      return [
        { key: "nama", text: "Nama" },
        { key: "harga", text: "Harga" },
        { key: "dihuni", text: "Dihuni" },
        { key: "actions", text: "Actions" }
      ];
    },
    perpages() {
      return [5, 10, 15, 25];
    }
  },
  watch: {
    cari: {
      deep: true,
      async handler() {
        await this.fetchData();
      }
    },
    async page() {
      await this.fetchData();
    },
    async perpage() {
      await this.fetchData();
    }
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async refresh() {
      this.cari = {};
      this.page = 1;
      this.perpage = 10;
    },
    async fetchData() {
      this.$store.dispatch("loading/start");
      try {
        await this.$store.dispatchPromise("kamar/getAll", {
          page: this.page,
          perpage: this.perpage,
          kos_id: this.kos.id,
          ...this.cari
        });
      } catch (err) {
        this.$store.dispatch("loading/fail");
      }
      this.$store.dispatch("loading/finish");
    },
    async getData(item = {}, type = "ganti") {
      const { id = "" } = item;
      if (_.isEmpty(id)) {
        return;
      }
      try {
        await this.$store.dispatchPromise("kamar/getById", { id });
        if (type === "ganti") {
          this.slide.ganti = true;
        } else if (type === "lihat") {
          this.slide.lihat = true;
        } else {
          return Promise.resolve();
        }
      } catch (err) {
        if (!_.include(["lihat", "ganti"], type)) {
          return Promise.reject(err);
        }
        this.$bvToast.toast(err.message, {
          title: "Error",
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right",
          appendToast: true
        });
      }
    },
    async hapusKamar(item) {
      try {
        await this.getData(item, "hapus");
        const res = await this.$swal.fire({
          title: "Anda yakin hapus ?",
          text: "Anda tidak bisa lagi mengembalikan data ini",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya Hapus Aja!"
        });
        if (res.isConfirmed) {
          await this.$store.dispatchPromise("kamar/destroy", { id: item.id });
          await this.fetchData();
        }
      } catch (err) {
        this.$bvToast.toast(err.message, {
          title: "Error",
          variant: "danger",
          solid: true,
          toaster: "b-toaster-bottom-right",
          appendToast: true
        });
      }
    }
  }
};
</script>
