<template>
  <b-sidebar
    v-model="slide"
    title="Tambah Kamar"
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
                <b-form-invalid-feedback v-if="!$v.form.harga.numeric">
                  Harga harus di isi dengan angka
                </b-form-invalid-feedback>
              </template>
            </b-form-group>
            <b-button type="submit" variant="primary">
              Simpan
            </b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </b-sidebar>
</template>

<script>
import { required, numeric } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

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
        harga: ""
      }
    };
  },
  computed: {
    slide: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    ...mapGetters("kos", {
      kos: "selected"
    })
  },
  validations: {
    form: {
      nama: {
        required
      },
      harga: {
        numeric
      }
    }
  },
  mounted() {
    this.form.harga = this.kos.harga_default;
  },
  methods: {
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
        await this.$store.dispatchPromise("kamar/create", {
          nama: this.form.nama,
          harga: this.form.harga
        });
        this.$store.dispatch("loading/finish");
        this.slide = false;
        this.$emit("re-fetch");
        this.$bvToast.toast("Berhasil tambah kamar", {
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
