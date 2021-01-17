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
            <b-form-group label="Nama" label-for="nama" class="mb-md-0">
              <b-input v-model="nama" id="nama" placeholder="Nama" />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Harga" label-for="harga" class="mb-0">
              <b-input
                type="number"
                v-model="harga"
                id="harga"
                placeholder="Harga"
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
    harga: {
      set(val) {
        const value = { ...this.value };
        if (_.isUndefined(val) || _.isNull(val) || val === "") {
          delete value.harga;
        } else {
          value.harga = val;
        }
        this.$emit("input", value);
      },
      get() {
        const harga = this.value?.harga;
        return harga || "";
      }
    },
    dihuni: {
      set(val) {
        const value = { ...this.value };
        if (_.isUndefined(val) || _.isNull(val) || val === "") {
          delete value.dihuni;
        } else {
          value.dihuni = val;
        }
        this.$emit("input", value);
      },
      get() {
        const dihuni = this.value?.dihuni;
        return dihuni || "";
      }
    }
  }
};
</script>
