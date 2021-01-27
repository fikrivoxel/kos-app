<template>
  <b-sidebar
    v-model="slide"
    title="Tambah Kamar Banyak"
    right
    backdrop
    bg-variant="white"
    backdrop-variant="dark"
    width="350px"
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
            <template v-for="(v, index) in $v.form.kamar.$each.$iter">
              <b-form-group
                :label="`Kamar ${indexingNumber(index)}`"
                :label-for="`nama-${index}`"
                :key="index"
              >
                <b-input-group>
                  <b-input
                    v-model="v.nama.$model"
                    :id="`nama-${index}`"
                    placeholder="Nama"
                    :state="validData(v.nama)"
                  />
                  <b-input-group-append>
                    <b-button
                      v-if="index === '0'"
                      variant="primary"
                      @click="addKamar"
                    >
                      <fa-layers class="fa-fw">
                        <fa-icon :icon="['fas', 'plus']" />
                      </fa-layers>
                    </b-button>
                    <b-button
                      v-else
                      variant="danger"
                      @click="deleteKamar(index)"
                    >
                      <fa-layers class="fa-fw">
                        <fa-icon :icon="['fas', 'minus']" />
                      </fa-layers>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
                <template
                  v-if="validData(v.nama) !== null && !validData(v.nama)"
                >
                  <b-form-invalid-feedback
                    v-if="!v.nama.required"
                    class="d-block"
                  >
                    Nama harus di isi
                  </b-form-invalid-feedback>
                </template>
              </b-form-group>
            </template>
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
import { required } from "vuelidate/lib/validators";
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
        kamar: [{ nama: "" }]
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
      kamar: {
        $each: {
          nama: {
            required
          }
        }
      }
    }
  },
  methods: {
    validData(name) {
      const { $dirty, $error } = name;
      if ($dirty) {
        return !$error;
      }
      return null;
    },
    addKamar() {
      this.form.kamar.push({ nama: "" });
    },
    deleteKamar(index) {
      index = parseInt(index);
      this.form.kamar.splice(index, 1);
    },
    async submitSave() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$store.dispatch("loading/start");
      try {
        await this.$store.dispatchPromise(
          "kamar/createBulk",
          this.form.kamar.map(kamar => {
            kamar.harga = this.kos.harga_default;
            return kamar;
          })
        );
        this.$store.dispatch("loading/finish");
        this.slide = false;
        this.$emit("re-fetch");
        this.$bvToast.toast("Berhasil tambah kamar banyak", {
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
    },
    indexingNumber(number) {
      return parseInt(number) + 1;
    }
  }
};
</script>
