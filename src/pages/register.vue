<template>
  <b-col md="9" lg="7">
    <b-form
      class="card shadow-lg border-0 rounded-lg my-5"
      @submit.prevent="submitRegister"
    >
      <b-card-header>
        <h3 class="text-center font-weight-light my-4">
          Register
        </h3>
      </b-card-header>
      <b-card-body>
        <b-form-group label="Username" label-for="username" label-class="small">
          <b-input
            v-model="$v.form.username.$model"
            id="username"
            placeholder="Username"
            :state="validData($v.form.username)"
          />
          <template
            v-if="
              validData($v.form.username) !== null &&
                !validData($v.form.username)
            "
          >
            <b-form-invalid-feedback v-if="!$v.form.username.required">
              Username harus di isi
            </b-form-invalid-feedback>
          </template>
        </b-form-group>
        <b-form-group label="Password" label-for="password" label-class="small">
          <b-input
            v-model="$v.form.password.$model"
            type="password"
            id="password"
            placeholder="Password"
            :state="validData($v.form.password)"
          />
          <template
            v-if="
              validData($v.form.password) !== null &&
                !validData($v.form.password)
            "
          >
            <b-form-invalid-feedback v-if="!$v.form.password.required">
              Password harus di isi
            </b-form-invalid-feedback>
          </template>
        </b-form-group>
        <b-form-row>
          <b-col md="6">
            <b-form-group
              label="Nama Awal"
              label-for="nama_awal"
              label-class="small"
            >
              <b-input
                v-model="$v.form.nama_awal.$model"
                id="nama_awal"
                placeholder="Nama Awal"
                :state="validData($v.form.nama_awal)"
              />
              <template
                v-if="
                  validData($v.form.nama_awal) !== null &&
                    !validData($v.form.nama_awal)
                "
              >
                <b-form-invalid-feedback v-if="!$v.form.nama_awal.required">
                  Nama Awal harus di isi
                </b-form-invalid-feedback>
              </template>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Nama Akhir"
              label-for="nama_akhir"
              label-class="small"
            >
              <b-input
                v-model="$v.form.nama_akhir.$model"
                id="nama_akhir"
                placeholder="Nama Akhir"
                :state="validData($v.form.nama_akhir)"
              />
              <template
                v-if="
                  validData($v.form.nama_akhir) !== null &&
                    !validData($v.form.nama_akhir)
                "
              >
                <b-form-invalid-feedback v-if="!$v.form.nama_akhir.required">
                  Nama Akhir harus di isi
                </b-form-invalid-feedback>
              </template>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-button type="submit" variant="primary" class="w-100">
          Register
        </b-button>
      </b-card-body>
      <b-card-footer class="text-center">
        <div class="small">
          <b-link to="/login">
            Have an account? Go to login
          </b-link>
        </div>
      </b-card-footer>
    </b-form>
  </b-col>
</template>

<route>
{
  "meta": {
    "middleware": ["isntauth"]
  }
}
</route>

<script>
import { required } from "vuelidate/lib/validators";
export default {
  layout: "guest",
  data() {
    return {
      form: {
        username: "",
        password: "",
        nama_awal: "",
        nama_akhir: ""
      }
    };
  },
  validations: {
    form: {
      username: {
        required
      },
      password: {
        required
      },
      nama_awal: {
        required
      },
      nama_akhir: {
        required
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
    async submitRegister() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      try {
        await this.$store.dispatchPromise("authentication/register", this.form);
        this.$bvToast.toast("Berhasil register, silahkan login kembali", {
          title: "Success",
          variant: "success",
          solid: true,
          toaster: "b-toaster-bottom-right",
          appendToast: true
        });
        this.$router.push("/login");
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
