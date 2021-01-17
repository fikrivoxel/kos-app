<template>
  <b-sidebar
    v-model="slide"
    title="Ganti Kos"
    right
    backdrop
    bg-variant="white"
    backdrop-variant="dark"
  >
    <template #header-close>
      <fa-layers class="fa-fw">
        <fa-icon :icon="['fas', 'times']" />
      </fa-layers>
    </template>
    <b-container fluid>
      <b-row>
        <b-col cols="12">
          <b-form @submit.prevent="submitSave">
            <b-form-group label="Nama" label-for="nama">
              <b-input
                v-model="$v.form.nama.$model"
                id="nama"
                placeholder="Nama"
                :state="validData($v.form.nama)"
              />
              <template
                v-if="
                  validData($v.form.nama) !== null && !validData($v.form.nama)
                "
              >
                <b-form-invalid-feedback v-if="!$v.form.nama.required">
                  Nama harus di isi
                </b-form-invalid-feedback>
              </template>
            </b-form-group>
            <b-form-group label="Harga" label-for="harga">
              <b-input
                v-model="$v.form.harga.$model"
                id="harga"
                placeholder="Harga"
                :state="validData($v.form.harga)"
              />
              <template
                v-if="
                  validData($v.form.harga) !== null && !validData($v.form.harga)
                "
              >
                <b-form-invalid-feedback v-if="!$v.form.harga.required">
                  Harga harus di isi
                </b-form-invalid-feedback>
                <b-form-invalid-feedback v-if="!$v.form.harga.numeric">
                  Harga harus di isi dengan angka
                </b-form-invalid-feedback>
              </template>
            </b-form-group>
            <b-form-group label="Tipe" label-for="tipe">
              <b-select v-model="form.tipe" :options="tipeOpts" />
            </b-form-group>
            <b-form-group label="Alamat" label-for="alamat">
              <b-textarea
                v-model="form.alamat"
                id="alamat"
                placeholder="Alamat"
              />
            </b-form-group>
            <b-button type="submit" variant="primary">
              Ganti
            </b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </b-sidebar>
</template>

<script>
import { mapGetters } from "vuex";
import { required, numeric } from "vuelidate/lib/validators";

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        nama: "",
        harga: "",
        tipe: "",
        alamat: ""
      }
    };
  },
  computed: {
    ...mapGetters("kos", ["selected"]),
    slide: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    tipeOpts() {
      return [
        { value: "biasa", text: "Biasa" },
        { value: "pasutri", text: "Pasutri" }
      ];
    }
  },
  watch: {
    slide() {
      if (this.slide) {
        this.setDefaultData();
      } else {
        this.resetForm();
      }
    }
  },
  validations: {
    form: {
      nama: {
        required
      },
      harga: {
        required,
        numeric
      }
    }
  },
  methods: {
    setDefaultData() {
      this.form = {
        nama: this.selected.nama,
        harga: this.selected.harga_default,
        tipe: this.selected.tipe,
        alamat: this.selected.alamat
      };
    },
    resetForm() {
      this.form = {
        nama: "",
        harga: "",
        tipe: "",
        alamat: ""
      };
      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    validData(name) {
      const { $dirty, $error } = name;
      if ($dirty) {
        return !$error;
      }
      return null;
    },
    async submitSave() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$store.dispatch("loading/start");
      try {
        await this.$store.dispatchPromise("kos/update", {
          id: this.selected.id,
          nama: this.form.nama,
          harga_default: this.form.harga,
          tipe: this.form.tipe,
          alamat: this.form.alamat
        });
        this.$store.dispatch("loading/finish");
        this.slide = false;
        this.$emit("re-fetch");
        this.$bvToast.toast("Berhasil ganti kos", {
          title: "Success",
          variant: "success",
          solid: true,
          toaster: "b-toaster-bottom-right",
          appendToast: true
        });
      } catch (err) {
        this.$store.dispatch("loading/fail");
        this.$store.dispatch("loading/finish");
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
