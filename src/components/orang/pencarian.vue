<template>
  <b-card no-body class="mb-3">
    <b-card-header class="d-flex align-items-center">
      Pencarian
      <b-button-group size="sm" class="ml-auto">
        <b-button variant="primary" @click="collapse = !collapse">
          <fa-layers class="fa-fw">
            <fa-icon :icon="['fas', !collapse ? 'angle-up' : 'angle-down']" />
          </fa-layers>
        </b-button>
        <b-button variant="danger" @click="$emit('input', {})">
          <fa-layers class="fa-fw">
            <fa-icon :icon="['fas', 'redo']" />
          </fa-layers>
        </b-button>
      </b-button-group>
    </b-card-header>
    <b-collapse v-model="collapse">
      <b-card-body>
        <b-form-row>
          <b-col md="6">
            <b-form-group label="Nama" label-for="nama">
              <b-input v-model="nama" id="nama" placeholder="Nama" />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Nomor KTP" label-for="nomor_ktp">
              <b-input
                type="text"
                v-model="nomor_ktp"
                id="nomor_ktp"
                placeholder="Nomor KTP"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Alamat" label-for="alamat" class="mb-md-0">
              <b-input
                type="text"
                v-model="alamat"
                id="alamat"
                placeholder="Alamat"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Telepon" label-for="telepon" class="mb-0">
              <b-input
                type="number"
                v-model="telepon"
                id="telepon"
                placeholder="Telepon"
              />
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      collapse: false
    };
  },
  computed: {
    nama: {
      set(val) {
        const value = { ...this.value };
        if (_.isUndefined(val) || _.isNull(val) || val === "") {
          delete value.nama;
        } else {
          value.nama = val;
        }
        this.$emit("input", value);
      },
      get() {
        const nama = this.value?.nama;
        return nama || "";
      }
    },
    nomor_ktp: {
      set(val) {
        const value = { ...this.value };
        if (_.isUndefined(val) || _.isNull(val) || val === "") {
          delete value.nomor_ktp;
        } else {
          value.nomor_ktp = val;
        }
        this.$emit("input", value);
      },
      get() {
        const nomor_ktp = this.value?.nomor_ktp;
        return nomor_ktp || "";
      }
    },
    alamat: {
      set(val) {
        const value = { ...this.value };
        if (_.isUndefined(val) || _.isNull(val) || val === "") {
          delete value.alamat;
        } else {
          value.alamat = val;
        }
        this.$emit("input", value);
      },
      get() {
        const alamat = this.value?.alamat;
        return alamat || "";
      }
    },
    telepon: {
      set(val) {
        const value = { ...this.value };
        if (_.isUndefined(val) || _.isNull(val) || val === "") {
          delete value.telepon;
        } else {
          value.telepon = val;
        }
        this.$emit("input", value);
      },
      get() {
        const telepon = this.value?.telepon;
        return telepon || "";
      }
    }
  }
};
</script>
